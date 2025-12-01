-- 1) 채팅 스레드
CREATE TABLE IF NOT EXISTS chat_thread (
                                           id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        TEXT,
    status       VARCHAR(20) NOT NULL DEFAULT 'active',         -- active, archived, deleted
    metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_thread_status CHECK (status IN ('active','archived','deleted'))
    );
CREATE INDEX IF NOT EXISTS ix_thread_status      ON chat_thread(status);
CREATE INDEX IF NOT EXISTS ix_thread_created_at  ON chat_thread(created_at DESC);

-- 2) 메시지
CREATE TABLE IF NOT EXISTS chat_message (
                                            id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id    UUID NOT NULL REFERENCES chat_thread(id) ON DELETE CASCADE,
    role         VARCHAR(20) NOT NULL,                           -- user, assistant, system
    content      TEXT NOT NULL,
    token_count  INT,
    status       VARCHAR(20) NOT NULL DEFAULT 'complete',        -- partial, complete, error
    metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_message_role   CHECK (role IN ('user','assistant','system')),
    CONSTRAINT ck_message_status CHECK (status IN ('partial','complete','error'))
    );
CREATE INDEX IF NOT EXISTS ix_msg_thread_created ON chat_message(thread_id, created_at);

-- 3) 일기
CREATE TABLE IF NOT EXISTS diary (
                                     id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id    UUID REFERENCES chat_thread(id) ON DELETE SET NULL,
    title        TEXT,
    content      TEXT NOT NULL,
    mood         VARCHAR(30),
    tags         TEXT[],
    metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    );
CREATE INDEX IF NOT EXISTS ix_diary_thread  ON diary(thread_id);
CREATE INDEX IF NOT EXISTS ix_diary_created ON diary(created_at DESC);