-- 003_indexes.sql
-- Performance Optimization: Create indexes on high-read columns, particularly foreign keys and timestamps

-- 1. Index institution_id for multi-tenant isolation performance
CREATE INDEX IF NOT EXISTS idx_users_institution_id ON users (institution_id);
CREATE INDEX IF NOT EXISTS idx_officer_sessions_institution_id ON officer_sessions (institution_id);
CREATE INDEX IF NOT EXISTS idx_generated_reports_institution_id ON generated_reports (institution_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_institution_id ON knowledge_documents (institution_id);
CREATE INDEX IF NOT EXISTS idx_student_attendance_institution_id ON student_attendance (institution_id);
CREATE INDEX IF NOT EXISTS idx_user_tracking_institution_id ON user_tracking (institution_id);

-- 2. Index common lookup fields
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

-- 3. Composite indexes for common queries
-- Example: Retrieving recent officer sessions for a specific institution
CREATE INDEX IF NOT EXISTS idx_officer_sessions_inst_created ON officer_sessions (institution_id, created_at DESC);

-- Example: Retrieving reports by type for a specific institution
CREATE INDEX IF NOT EXISTS idx_generated_reports_inst_type ON generated_reports (institution_id, report_type);

-- 4. Vector Search Index (If pgvector is installed)
-- CREATE INDEX IF NOT EXISTS idx_knowledge_docs_embedding ON knowledge_documents USING hnsw (embedding vector_cosine_ops);
