import { studentDummyIds } from '../utils/studentCatalog'

const studentUsers = studentDummyIds.map((student, index) => ({
  username: student.id,
  password: 'student123',
  name: student.name,
  section: student.section,
  stream: student.stream,
  alias: index === 0 ? 'student' : null,
}))

const users = {
  student: studentUsers[0],
  faculty: {
    username: 'faculty',
    password: 'faculty123',
    name: 'Dr. S. Kumar',
  },
  parent: {
    username: 'parent',
    password: 'parent123',
    name: 'Lakshmi Devi',
  },
  admin: {
    username: 'admin',
    password: 'admin123',
    name: 'System Administrator',
  },
}

export async function loginWithRole({ role, username, password }) {
  await new Promise((resolve) => {
    setTimeout(resolve, 500)
  })

  const user = role === 'student'
    ? studentUsers.find((candidate) => candidate.username === username || candidate.alias === username)
    : users[role]

  if (!user || user.password !== password) {
    throw new Error('Invalid credentials. Use the demo credentials shown on the login page.')
  }

  return {
    token: `demo-token-${role}`,
    user: {
      role,
      name: user.name,
      username: user.username,
      section: user.section,
      stream: user.stream,
    },
  }
}
