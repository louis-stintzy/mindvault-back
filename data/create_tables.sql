BEGIN;

DROP TABLE IF EXISTS "box", "card", "user";

CREATE TABLE "user" (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    pwd CHAR(60) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    picture VARCHAR(255),
    app_role INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ
);

CREATE TABLE "box" (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES "user"(id),
    original_box_id INTEGER NOT NULL,
    original_box_creator_id INTEGER NOT NULL,
    original_box_created_at TIMESTAMPTZ NOT NULL,
    copy_box_id INTEGER,
    copy_box_owner_id INTEGER,
    copy_box_created_at TIMESTAMPTZ,
    history TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    box_picture VARCHAR(255),
    color VARCHAR(15),
    label VARCHAR(30),
    level VARCHAR(30),
    position INTEGER NOT NULL,
    learn_it BOOLEAN NOT NULL DEFAULT true,
    type INTEGER NOT NULL DEFAULT 2,
    parent_box_id INTEGER REFERENCES "box"(id),
    on_store INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ
);

CREATE TABLE "card" (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    box_id INTEGER NOT NULL REFERENCES "box"(id),
    creator_id INTEGER NOT NULL REFERENCES "user"(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    attachment VARCHAR(255),
    position INTEGER NOT NULL,
    compartment INTEGER NOT NULL,
    date_to_ask TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '1 day',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
);

COMMIT;