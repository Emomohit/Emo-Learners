-- Rename old syllabus subjects to preserve any existing resources
UPDATE public.subjects 
SET 
  code = code || '-OLD',
  name = name || ' (Old Syllabus)'
WHERE branch = 'CSE-IT' AND semester IN (3, 4, 5);

-- Insert new Flexible Curricula subjects for CSE-IT (Semesters 3, 4, 5)
INSERT INTO public.subjects (branch, semester, code, name) VALUES
  -- Semester 3
  ('CSE-IT', 3, 'ES301', 'Energy & Environmental Engineering'),
  ('CSE-IT', 3, 'IT302', 'Discrete Structure'),
  ('CSE-IT', 3, 'IT303', 'Data Structure'),
  ('CSE-IT', 3, 'IT304', 'Object Oriented Programming & Methodology'),
  ('CSE-IT', 3, 'IT305', 'Digital Circuits & System'),
  
  -- Semester 4
  ('CSE-IT', 4, 'BT401', 'Mathematics-III'),
  ('CSE-IT', 4, 'IT402', 'Computer Architecture'),
  ('CSE-IT', 4, 'IT403', 'Analysis and Design of Algorithm'),
  ('CSE-IT', 4, 'IT404', 'Analog & Digital Communication'),
  ('CSE-IT', 4, 'IT405', 'Data base Management System'),
  
  -- Semester 5
  ('CSE-IT', 5, 'IT501', 'Operating System'),
  ('CSE-IT', 5, 'IT502', 'Computer Network'),
  ('CSE-IT', 5, 'IT503', 'Departmental Elective-I'),
  ('CSE-IT', 5, 'IT504', 'Open Elective-I');
