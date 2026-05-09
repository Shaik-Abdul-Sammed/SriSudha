export const studentDummyIds = [
  { id: 'ss26@school.com', name: 'Sai Sree', stream: 'MPC', section: 'MPC-A' },
  { id: 'ss27@school.com', name: 'Sahana Reddy', stream: 'BIPC', section: 'BIPC-B' },
  { id: 'ss28@school.com', name: 'Sriram Kumar', stream: 'MBIPC', section: 'MBIPC-A' },
  { id: 'ss29@school.com', name: 'Anika Rao', stream: 'MPC', section: 'MPC-B' },
  { id: 'ss30@school.com', name: 'Harsha Vardhan', stream: 'BIPC', section: 'BIPC-A' },
]

export const courseTracks = [
  {
    title: 'Inter JEE Mains',
    stream: 'MPC',
    section: 'MPC Core',
    focus: 'Physics, Chemistry, and Mathematics with entrance problem drills',
  },
  {
    title: 'NEET Foundation',
    stream: 'BIPC',
    section: 'BIPC Core',
    focus: 'Biology, Physics, and Chemistry with concept mapping',
  },
  {
    title: 'MBIPC Medical Bridge',
    stream: 'MBIPC',
    section: 'MBIPC Hybrid',
    focus: 'Mixed bridge classes for medical and applied science routes',
  },
  {
    title: 'MPC Accelerator',
    stream: 'MPC',
    section: 'MPC Advanced',
    focus: 'Weekly revision, mock tests, and rank-improvement practice',
  },
  {
    title: 'BIPC Bio Lab Track',
    stream: 'BIPC',
    section: 'BIPC Lab',
    focus: 'Diagram practice, NCERT references, and viva preparation',
  },
]

export const referenceLibrary = [
  { title: 'NCERT Biology', tag: 'NEET Core', format: 'Textbook' },
  { title: 'H C Verma', tag: 'JEE Mains Core', format: 'Physics Reference' },
  { title: 'RD Sharma', tag: 'MPC Core', format: 'Practice Book' },
  { title: 'Errorless Chemistry', tag: 'Competitive Prep', format: 'Question Bank' },
  { title: 'Previous Year Papers', tag: 'All Streams', format: 'Exam Archive' },
]

export const weeklyExamSchedule = [
  { day: 'Monday', title: 'MPC Weekly Test', section: 'MPC-A / MPC-B', topic: 'Algebra and Trigonometry' },
  { day: 'Wednesday', title: 'BIPC Weekly Test', section: 'BIPC-A / BIPC-B', topic: 'Biology Chapters 1-4' },
  { day: 'Friday', title: 'JEE Mains Sprint', section: 'MPC Core', topic: 'Physics formula recall' },
  { day: 'Saturday', title: 'NEET Revision Test', section: 'BIPC Core', topic: 'Chemistry practice set' },
]

export const sectionMap = [
  { code: 'MPC-A', stream: 'MPC', capacity: 45 },
  { code: 'MPC-B', stream: 'MPC', capacity: 45 },
  { code: 'BIPC-A', stream: 'BIPC', capacity: 40 },
  { code: 'BIPC-B', stream: 'BIPC', capacity: 40 },
  { code: 'MBIPC-A', stream: 'MBIPC', capacity: 35 },
]