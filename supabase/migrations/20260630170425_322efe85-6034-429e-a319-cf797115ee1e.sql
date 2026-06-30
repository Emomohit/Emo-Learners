
DELETE FROM public.resources;
DELETE FROM public.subjects;

INSERT INTO public.subjects (branch, semester, code, name) VALUES
  ('CSE',1,'BT101','English for Communication'),
  ('CSE',1,'BT102','Engineering Mathematics-I'),
  ('CSE',1,'BT103','Engineering Physics'),
  ('CSE',1,'BT104','Basic Mechanical Engineering'),
  ('CSE',1,'BT105','Engineering Graphics'),
  ('CSE-IT',1,'BT101','English for Communication'),
  ('CSE-IT',1,'BT102','Engineering Mathematics-I'),
  ('CSE-IT',1,'BT103','Engineering Physics'),
  ('CSE-IT',1,'BT104','Basic Mechanical Engineering'),
  ('CSE-IT',1,'BT105','Engineering Graphics'),
  ('CSE-CY',1,'BT101','English for Communication'),
  ('CSE-CY',1,'BT102','Engineering Mathematics-I'),
  ('CSE-CY',1,'BT103','Engineering Physics'),
  ('CSE-CY',1,'BT104','Basic Mechanical Engineering'),
  ('CSE-CY',1,'BT105','Engineering Graphics'),
  ('AIML',1,'BT101','English for Communication'),
  ('AIML',1,'BT102','Engineering Mathematics-I'),
  ('AIML',1,'BT103','Engineering Physics'),
  ('AIML',1,'BT104','Basic Mechanical Engineering'),
  ('AIML',1,'BT105','Engineering Graphics'),
  ('CSE',2,'BT201','Engineering Chemistry'),
  ('CSE',2,'BT202','Engineering Mathematics-II'),
  ('CSE',2,'BT203','Basic Electrical & Electronics Engineering'),
  ('CSE',2,'BT204','Basic Civil Engineering & Mechanics'),
  ('CSE',2,'BT205','Manufacturing Practices'),
  ('CSE-IT',2,'BT201','Engineering Chemistry'),
  ('CSE-IT',2,'BT202','Engineering Mathematics-II'),
  ('CSE-IT',2,'BT203','Basic Electrical & Electronics Engineering'),
  ('CSE-IT',2,'BT204','Basic Civil Engineering & Mechanics'),
  ('CSE-IT',2,'BT205','Manufacturing Practices'),
  ('CSE-CY',2,'BT201','Engineering Chemistry'),
  ('CSE-CY',2,'BT202','Engineering Mathematics-II'),
  ('CSE-CY',2,'BT203','Basic Electrical & Electronics Engineering'),
  ('CSE-CY',2,'BT204','Basic Civil Engineering & Mechanics'),
  ('CSE-CY',2,'BT205','Manufacturing Practices'),
  ('AIML',2,'BT201','Engineering Chemistry'),
  ('AIML',2,'BT202','Engineering Mathematics-II'),
  ('AIML',2,'BT203','Basic Electrical & Electronics Engineering'),
  ('AIML',2,'BT204','Basic Civil Engineering & Mechanics'),
  ('AIML',2,'BT205','Manufacturing Practices');

INSERT INTO public.subjects (branch, semester, code, name) VALUES
  ('CSE',3,'BT301','Engineering Mathematics-III'),
  ('CSE',3,'CS302','Data Structures'),
  ('CSE',3,'CS303','Digital Systems'),
  ('CSE',3,'CS304','Object Oriented Programming and Methodology'),
  ('CSE',3,'CS305','Communication Skills'),
  ('CSE',4,'BT401','Engineering Mathematics-IV'),
  ('CSE',4,'CS402','Analysis and Design of Algorithms'),
  ('CSE',4,'CS403','Computer Organization and Architecture'),
  ('CSE',4,'CS404','Discrete Structure'),
  ('CSE',4,'CS405','Software Engineering'),
  ('CSE',5,'CS501','Theory of Computation'),
  ('CSE',5,'CS502','Database Management Systems'),
  ('CSE',5,'CS503','Operating Systems'),
  ('CSE',5,'CS504','Computer Networks'),
  ('CSE',5,'CS505','Departmental Elective-1'),
  ('CSE',6,'CS601','Machine Learning'),
  ('CSE',6,'CS602','Compiler Design'),
  ('CSE',6,'CS603','Computer Graphics and Multimedia'),
  ('CSE',6,'CS604','Departmental Elective-2'),
  ('CSE',6,'CS605','Open Elective-1'),
  ('CSE',7,'CS701','Internet and Web Technology'),
  ('CSE',7,'CS702','Information Storage and Management'),
  ('CSE',7,'CS703','Departmental Elective-3'),
  ('CSE',7,'CS704','Open Elective-2'),
  ('CSE',7,'CS705','Industrial Training / Major Project-I'),
  ('CSE',8,'CS801','Soft Computing'),
  ('CSE',8,'CS802','Web Engineering'),
  ('CSE',8,'CS803','Departmental Elective-4'),
  ('CSE',8,'CS804','Open Elective-3'),
  ('CSE',8,'CS805','Major Project-II');

INSERT INTO public.subjects (branch, semester, code, name) VALUES
  ('CSE-IT',3,'BT301','Engineering Mathematics-III'),
  ('CSE-IT',3,'IT302','Data Structures'),
  ('CSE-IT',3,'IT303','Digital Circuit and Systems'),
  ('CSE-IT',3,'IT304','Object Oriented Programming with Java'),
  ('CSE-IT',3,'IT305','Communication Skills'),
  ('CSE-IT',4,'BT401','Engineering Mathematics-IV'),
  ('CSE-IT',4,'IT402','Computer System Organization'),
  ('CSE-IT',4,'IT403','Analysis and Design of Algorithms'),
  ('CSE-IT',4,'IT404','Discrete Structure'),
  ('CSE-IT',4,'IT405','Internet and Web Technology-I'),
  ('CSE-IT',5,'IT501','Database Management Systems'),
  ('CSE-IT',5,'IT502','Operating Systems'),
  ('CSE-IT',5,'IT503','Software Engineering & Project Management'),
  ('CSE-IT',5,'IT504','Theory of Computation'),
  ('CSE-IT',5,'IT505','Departmental Elective-1'),
  ('CSE-IT',6,'IT601','Computer Networks'),
  ('CSE-IT',6,'IT602','Compiler Design'),
  ('CSE-IT',6,'IT603','Data Analytics'),
  ('CSE-IT',6,'IT604','Departmental Elective-2'),
  ('CSE-IT',6,'IT605','Open Elective-1'),
  ('CSE-IT',7,'IT701','Information Storage and Management'),
  ('CSE-IT',7,'IT702','Cyber Security'),
  ('CSE-IT',7,'IT703','Departmental Elective-3'),
  ('CSE-IT',7,'IT704','Open Elective-2'),
  ('CSE-IT',7,'IT705','Industrial Training / Major Project-I'),
  ('CSE-IT',8,'IT801','Internet of Things'),
  ('CSE-IT',8,'IT802','Wireless and Mobile Computing'),
  ('CSE-IT',8,'IT803','Departmental Elective-4'),
  ('CSE-IT',8,'IT804','Open Elective-3'),
  ('CSE-IT',8,'IT805','Major Project-II');

INSERT INTO public.subjects (branch, semester, code, name) VALUES
  ('CSE-CY',3,'CY301','Technical Communication'),
  ('CSE-CY',3,'CY302','Data Structures'),
  ('CSE-CY',3,'CY303','Digital Logic Design'),
  ('CSE-CY',3,'CY304','Discrete Structure'),
  ('CSE-CY',3,'CY305','Cyber Law and Ethics'),
  ('CSE-CY',4,'CY401','Introduction to Linear Algebra'),
  ('CSE-CY',4,'CY402','Software Engineering'),
  ('CSE-CY',4,'CY403','Database Management Systems'),
  ('CSE-CY',4,'CY404','Foundations of Cyber Security'),
  ('CSE-CY',4,'CY405','Computer Architecture'),
  ('CSE-CY',5,'CY501','OS Internals for Security Support'),
  ('CSE-CY',5,'CY502','Cryptography & Network Security'),
  ('CSE-CY',5,'CY503','Web Technology'),
  ('CSE-CY',5,'CY504','Theory of Computation'),
  ('CSE-CY',5,'CY505','Departmental Elective-1'),
  ('CSE-CY',6,'CY601','Computer Networks'),
  ('CSE-CY',6,'CY602','Ethical Hacking'),
  ('CSE-CY',6,'CY603','Machine Learning for Security'),
  ('CSE-CY',6,'CY604','Departmental Elective-2'),
  ('CSE-CY',6,'CY605','Open Elective-1'),
  ('CSE-CY',7,'CY701','Information Security Audit and Monitoring'),
  ('CSE-CY',7,'CY702','Cyber Forensics'),
  ('CSE-CY',7,'CY703','Departmental Elective-3'),
  ('CSE-CY',7,'CY704','Open Elective-2'),
  ('CSE-CY',7,'CY705','Industrial Training / Major Project-I'),
  ('CSE-CY',8,'CY801','Blockchain Technology'),
  ('CSE-CY',8,'CY802','Cloud Security'),
  ('CSE-CY',8,'CY803','Departmental Elective-4'),
  ('CSE-CY',8,'CY804','Open Elective-3'),
  ('CSE-CY',8,'CY805','Major Project-II');

INSERT INTO public.subjects (branch, semester, code, name) VALUES
  ('AIML',3,'AL301','Technical Communication'),
  ('AIML',3,'AL302','Data Structures'),
  ('AIML',3,'AL303','Digital Circuits'),
  ('AIML',3,'AL304','Engineering Mathematics-III'),
  ('AIML',3,'AL305','Python for Artificial Intelligence'),
  ('AIML',4,'AL401','Introduction to Discrete Structure & Linear Algebra'),
  ('AIML',4,'AL402','Foundation of Data Science'),
  ('AIML',4,'AL403','Database Management Systems'),
  ('AIML',4,'AL404','Software Engineering'),
  ('AIML',4,'AL405','Operating Systems'),
  ('AIML',5,'AL501','Introduction to Artificial Intelligence'),
  ('AIML',5,'AL502','Computer Networks'),
  ('AIML',5,'AL503','Machine Learning'),
  ('AIML',5,'AL504','Analysis and Design of Algorithms'),
  ('AIML',5,'AL505','Departmental Elective-1'),
  ('AIML',6,'AL601','Computer Vision'),
  ('AIML',6,'AL602','Natural Language Processing'),
  ('AIML',6,'AL603','Deep Learning'),
  ('AIML',6,'AL604','Departmental Elective-2'),
  ('AIML',6,'AL605','Open Elective-1'),
  ('AIML',7,'AL701','Reinforcement Learning'),
  ('AIML',7,'AL702','Big Data Analytics'),
  ('AIML',7,'AL703','Departmental Elective-3'),
  ('AIML',7,'AL704','Open Elective-2'),
  ('AIML',7,'AL705','Industrial Training / Major Project-I'),
  ('AIML',8,'AL801','Business Intelligence'),
  ('AIML',8,'AL802','Generative AI'),
  ('AIML',8,'AL803','Departmental Elective-4'),
  ('AIML',8,'AL804','Open Elective-3'),
  ('AIML',8,'AL805','Major Project-II');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.custom_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '📝',
  description TEXT,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  minutes INTEGER NOT NULL DEFAULT 20,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.custom_tests TO authenticated;
GRANT ALL ON public.custom_tests TO service_role;

ALTER TABLE public.custom_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read published tests"
  ON public.custom_tests FOR SELECT TO authenticated
  USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert tests"
  ON public.custom_tests FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tests"
  ON public.custom_tests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tests"
  ON public.custom_tests FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_custom_tests_updated_at
  BEFORE UPDATE ON public.custom_tests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
