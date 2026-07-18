
-- 1. Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'student');
CREATE TYPE public.branch_code AS ENUM ('CSE', 'CSE-IT', 'CSE-CY', 'AIML');
CREATE TYPE public.resource_kind AS ENUM ('notes', 'pyq', 'syllabus', 'important_qs');

-- 2. Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  branch public.branch_code,
  current_semester SMALLINT CHECK (current_semester BETWEEN 1 AND 8),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self_read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 3. User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_self_read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admins can read all roles
CREATE POLICY "user_roles_admin_read_all" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 4. Subjects
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch public.branch_code NOT NULL,
  semester SMALLINT NOT NULL CHECK (semester BETWEEN 1 AND 8),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (branch, semester, code)
);
GRANT SELECT ON public.subjects TO anon, authenticated;
GRANT ALL ON public.subjects TO service_role;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subjects_public_read" ON public.subjects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "subjects_admin_write" ON public.subjects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Resources
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  kind public.resource_kind NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  year SMALLINT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX resources_subject_idx ON public.resources(subject_id);
CREATE INDEX resources_kind_idx ON public.resources(kind);
CREATE INDEX resources_created_idx ON public.resources(created_at DESC);
GRANT SELECT ON public.resources TO anon, authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resources_public_read" ON public.resources FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "resources_admin_write" ON public.resources FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Feedback
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.feedback TO anon, authenticated;
GRANT SELECT ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feedback_public_insert" ON public.feedback FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "feedback_admin_read" ON public.feedback FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 7. AI conversations / messages
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ai_conv_user_idx ON public.ai_conversations(user_id, updated_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_conversations TO authenticated;
GRANT ALL ON public.ai_conversations TO service_role;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_conv_owner_all" ON public.ai_conversations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  parts JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ai_messages_conv_idx ON public.ai_messages(conversation_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_messages TO authenticated;
GRANT ALL ON public.ai_messages TO service_role;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_msg_owner_all" ON public.ai_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 8. updated_at trigger helper
CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER ai_conv_set_updated_at BEFORE UPDATE ON public.ai_conversations FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 9. Auto-create profile + default student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  ) ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Bootstrap founder admin on verified email
CREATE OR REPLACE FUNCTION public.grant_admin_for_founder() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND lower(NEW.email) = 'contact@example.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_grant_admin AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.grant_admin_for_founder();
CREATE TRIGGER on_auth_user_confirmed_grant_admin AFTER UPDATE OF email_confirmed_at ON auth.users FOR EACH ROW WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL) EXECUTE FUNCTION public.grant_admin_for_founder();

-- 11. Seed subjects (4 branches x 8 semesters)
-- Common sem 1 & 2 across branches (engineering basics)
INSERT INTO public.subjects (branch, semester, code, name) VALUES
-- CSE sem 1
('CSE',1,'BMA101','Engineering Mathematics I'),('CSE',1,'BPH101','Engineering Physics'),('CSE',1,'BEC101','Basic Electronics'),('CSE',1,'BCS101','Programming in C'),('CSE',1,'BEN101','Communicative English'),
-- CSE sem 2
('CSE',2,'BMA201','Engineering Mathematics II'),('CSE',2,'BCH201','Engineering Chemistry'),('CSE',2,'BEE201','Basic Electrical Engineering'),('CSE',2,'BME201','Engineering Mechanics'),('CSE',2,'BCS201','Python Programming'),
-- CSE sem 3
('CSE',3,'CS301','Data Structures'),('CSE',3,'CS302','Digital Logic Design'),('CSE',3,'CS303','Discrete Mathematics'),('CSE',3,'CS304','OOP with Java'),('CSE',3,'MA301','Probability & Statistics'),
-- CSE sem 4
('CSE',4,'CS401','Algorithms Design & Analysis'),('CSE',4,'CS402','Computer Organization'),('CSE',4,'CS403','Operating Systems'),('CSE',4,'CS404','Database Management Systems'),('CSE',4,'CS405','Theory of Computation'),
-- CSE sem 5
('CSE',5,'CS501','Computer Networks'),('CSE',5,'CS502','Software Engineering'),('CSE',5,'CS503','Web Technologies'),('CSE',5,'CS504','Microprocessors'),('CSE',5,'CS505','Compiler Design'),
-- CSE sem 6
('CSE',6,'CS601','Artificial Intelligence'),('CSE',6,'CS602','Machine Learning Basics'),('CSE',6,'CS603','Cloud Computing'),('CSE',6,'CS604','Mobile App Development'),('CSE',6,'CS605','Information Security'),
-- CSE sem 7
('CSE',7,'CS701','Big Data Analytics'),('CSE',7,'CS702','Distributed Systems'),('CSE',7,'CS703','Cryptography'),('CSE',7,'CS704','DevOps & Cloud Native'),('CSE',7,'CS705','Project Work I'),
-- CSE sem 8
('CSE',8,'CS801','Deep Learning'),('CSE',8,'CS802','Blockchain Technology'),('CSE',8,'CS803','Internet of Things'),('CSE',8,'CS804','Major Project'),('CSE',8,'CS805','Professional Ethics');

-- CSE-IT
INSERT INTO public.subjects (branch, semester, code, name) VALUES
('CSE-IT',1,'BMA101','Engineering Mathematics I'),('CSE-IT',1,'BPH101','Engineering Physics'),('CSE-IT',1,'BCS101','Programming in C'),('CSE-IT',1,'BEN101','Communicative English'),
('CSE-IT',2,'BMA201','Engineering Mathematics II'),('CSE-IT',2,'BCH201','Engineering Chemistry'),('CSE-IT',2,'BEE201','Basic Electrical Engineering'),('CSE-IT',2,'BCS201','Python Programming'),
('CSE-IT',3,'IT301','Data Structures'),('CSE-IT',3,'IT302','Object Oriented Programming'),('CSE-IT',3,'IT303','Digital Systems'),('CSE-IT',3,'IT304','Discrete Mathematics'),
('CSE-IT',4,'IT401','Database Management Systems'),('CSE-IT',4,'IT402','Operating Systems'),('CSE-IT',4,'IT403','Computer Networks'),('CSE-IT',4,'IT404','Web Programming'),
('CSE-IT',5,'IT501','Software Engineering'),('CSE-IT',5,'IT502','Information Theory'),('CSE-IT',5,'IT503','System Software'),('CSE-IT',5,'IT504','Data Warehousing & Mining'),
('CSE-IT',6,'IT601','Cloud Computing'),('CSE-IT',6,'IT602','Mobile Computing'),('CSE-IT',6,'IT603','Network Security'),('CSE-IT',6,'IT604','Enterprise Resource Planning'),
('CSE-IT',7,'IT701','Big Data Analytics'),('CSE-IT',7,'IT702','IT Project Management'),('CSE-IT',7,'IT703','Service Oriented Architecture'),('CSE-IT',7,'IT704','Minor Project'),
('CSE-IT',8,'IT801','Cyber Forensics'),('CSE-IT',8,'IT802','Internet of Things'),('CSE-IT',8,'IT803','Major Project'),('CSE-IT',8,'IT804','Professional Ethics');

-- CSE-CY (Cyber Security)
INSERT INTO public.subjects (branch, semester, code, name) VALUES
('CSE-CY',1,'BMA101','Engineering Mathematics I'),('CSE-CY',1,'BPH101','Engineering Physics'),('CSE-CY',1,'BCS101','Programming in C'),('CSE-CY',1,'BEN101','Communicative English'),
('CSE-CY',2,'BMA201','Engineering Mathematics II'),('CSE-CY',2,'BCH201','Engineering Chemistry'),('CSE-CY',2,'BEE201','Basic Electrical Engineering'),('CSE-CY',2,'BCS201','Python Programming'),
('CSE-CY',3,'CY301','Data Structures'),('CSE-CY',3,'CY302','Computer Organization'),('CSE-CY',3,'CY303','Discrete Math & Number Theory'),('CSE-CY',3,'CY304','Intro to Cyber Security'),
('CSE-CY',4,'CY401','Operating Systems'),('CSE-CY',4,'CY402','Computer Networks'),('CSE-CY',4,'CY403','DBMS'),('CSE-CY',4,'CY404','Cryptography Fundamentals'),
('CSE-CY',5,'CY501','Network Security'),('CSE-CY',5,'CY502','Web Application Security'),('CSE-CY',5,'CY503','Ethical Hacking'),('CSE-CY',5,'CY504','Secure Software Engineering'),
('CSE-CY',6,'CY601','Digital Forensics'),('CSE-CY',6,'CY602','Malware Analysis'),('CSE-CY',6,'CY603','Cloud Security'),('CSE-CY',6,'CY604','Cyber Laws & IT Act'),
('CSE-CY',7,'CY701','Penetration Testing'),('CSE-CY',7,'CY702','Incident Response & SOC'),('CSE-CY',7,'CY703','Blockchain Security'),('CSE-CY',7,'CY704','Minor Project'),
('CSE-CY',8,'CY801','Advanced Cryptography'),('CSE-CY',8,'CY802','IoT Security'),('CSE-CY',8,'CY803','Major Project'),('CSE-CY',8,'CY804','Professional Ethics');

-- AIML
INSERT INTO public.subjects (branch, semester, code, name) VALUES
('AIML',1,'BMA101','Engineering Mathematics I'),('AIML',1,'BPH101','Engineering Physics'),('AIML',1,'BCS101','Programming in C'),('AIML',1,'BEN101','Communicative English'),
('AIML',2,'BMA201','Engineering Mathematics II'),('AIML',2,'BCH201','Engineering Chemistry'),('AIML',2,'BEE201','Basic Electrical Engineering'),('AIML',2,'BCS201','Python for AI'),
('AIML',3,'AI301','Data Structures'),('AIML',3,'AI302','Linear Algebra for AI'),('AIML',3,'AI303','Probability & Statistics'),('AIML',3,'AI304','OOP & Python Libraries'),
('AIML',4,'AI401','DBMS'),('AIML',4,'AI402','Operating Systems'),('AIML',4,'AI403','Intro to Machine Learning'),('AIML',4,'AI404','Discrete Mathematics'),
('AIML',5,'AI501','Neural Networks & Deep Learning'),('AIML',5,'AI502','Computer Vision'),('AIML',5,'AI503','Natural Language Processing'),('AIML',5,'AI504','Data Mining'),
('AIML',6,'AI601','Reinforcement Learning'),('AIML',6,'AI602','MLOps & Cloud ML'),('AIML',6,'AI603','Big Data Analytics'),('AIML',6,'AI604','AI Ethics'),
('AIML',7,'AI701','Generative AI & LLMs'),('AIML',7,'AI702','Time Series Forecasting'),('AIML',7,'AI703','AI in Healthcare'),('AIML',7,'AI704','Minor Project'),
('AIML',8,'AI801','Advanced Deep Learning'),('AIML',8,'AI802','AI for Robotics'),('AIML',8,'AI803','Major Project'),('AIML',8,'AI804','Professional Ethics');
