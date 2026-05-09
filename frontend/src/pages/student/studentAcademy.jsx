import RolePageTemplate from '../../components/RolePageTemplate'
import StudentAcademyPanel from '../../components/StudentAcademyPanel'

export default function Page() {
  return (
    <RolePageTemplate
      role="Student"
      title="Student Academy"
      description="Explore entrance-exam tracks, references, weekly exams, and sections."
    >
      <StudentAcademyPanel />
    </RolePageTemplate>
  )
}