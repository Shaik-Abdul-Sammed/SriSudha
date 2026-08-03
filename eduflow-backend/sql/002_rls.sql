-- 002_rls.sql
-- Enable Row Level Security (RLS) on all tenant-specific tables to prevent cross-tenant data leakage

-- 1. Enable RLS on core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE officer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tracking ENABLE ROW LEVEL SECURITY;

-- 2. Create Isolation Policies
-- These policies require the application to set 'app.current_institution_id' during a transaction.
-- e.g., SET LOCAL app.current_institution_id = '1234-uuid-5678';

CREATE POLICY users_isolation_policy ON users
    USING (institution_id = current_setting('app.current_institution_id', true)::UUID);

CREATE POLICY officer_sessions_isolation_policy ON officer_sessions
    USING (institution_id = current_setting('app.current_institution_id', true)::UUID);

CREATE POLICY generated_reports_isolation_policy ON generated_reports
    USING (institution_id = current_setting('app.current_institution_id', true)::UUID);

CREATE POLICY knowledge_docs_isolation_policy ON knowledge_documents
    USING (institution_id = current_setting('app.current_institution_id', true)::UUID);

CREATE POLICY student_attendance_isolation_policy ON student_attendance
    USING (institution_id = current_setting('app.current_institution_id', true)::UUID);

CREATE POLICY user_tracking_isolation_policy ON user_tracking
    USING (institution_id = current_setting('app.current_institution_id', true)::UUID);
