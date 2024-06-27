BEGIN;

DROP TABLE IF EXISTS "box_historical_stats", "box", "card", "user";

CREATE TABLE "user" (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    pwd CHAR(60) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    picture VARCHAR(255),
    app_role INTEGER NOT NULL DEFAULT 0,
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE "box" (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES "user"(id),
    original_box_id INTEGER,
    original_box_creator_id INTEGER NOT NULL,
    original_box_created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    copy_box_id INTEGER,
    copy_box_owner_id INTEGER,
    copy_box_created_at TIMESTAMPTZ,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    picture_id INTEGER UNIQUE REFERENCES "picture"(id) ON DELETE SET NULL,
    color VARCHAR(15),
    label VARCHAR(30),
    level VARCHAR(30),
    default_question_language VARCHAR(10) NOT NULL DEFAULT 'fr-FR',
    default_question_voice VARCHAR(255),
    default_answer_language VARCHAR(10) NOT NULL DEFAULT 'fr-FR',
    default_answer_voice VARCHAR(255),
    position INTEGER NOT NULL,
    learn_it BOOLEAN NOT NULL DEFAULT true,
    type INTEGER NOT NULL DEFAULT 2,
    parent_box_id INTEGER REFERENCES "box"(id),
    on_store INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
);
-- // todo: supprimer box_picture VARCHAR(255),

-- CREATE TABLE duplication_history (
--     history_id SERIAL PRIMARY KEY,
--     original_box_id INTEGER NOT NULL,
--     copied_box_id INTEGER NOT NULL,
--     new_box_id INTEGER NOT NULL,
--     duplicator_user_id INTEGER NOT NULL,
--     duplication_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (original_box_id) REFERENCES box(id),
--     FOREIGN KEY (copied_box_id) REFERENCES box(id),
--     FOREIGN KEY (new_box_id) REFERENCES box(id),
--     FOREIGN KEY (duplicator_user_id) REFERENCES users(id) -- Assurez-vous que la table des utilisateurs correspond à votre schéma.
-- );

CREATE TABLE "card" (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    box_id INTEGER NOT NULL REFERENCES "box"(id) ON DELETE CASCADE,
    creator_id INTEGER NOT NULL REFERENCES "user"(id),
    question_language VARCHAR(10) NOT NULL DEFAULT 'fr-FR',
    question_voice VARCHAR(255),
    answer_language VARCHAR(10) NOT NULL DEFAULT 'fr-FR',
    answer_voice VARCHAR(255),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    attachment VARCHAR(255),
    position INTEGER NOT NULL,
    compartment INTEGER NOT NULL,
    -- compartments_history INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    -- revision_count INTEGER NOT NULL DEFAULT 0,
    date_to_ask TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '1 day',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE "picture" (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
    box_id INTEGER UNIQUE REFERENCES "box"(id) ON DELETE CASCADE,
    card_id INTEGER UNIQUE REFERENCES "card"(id) ON DELETE CASCADE,
    picture_url TEXT NOT NULL,
    photographer_name VARCHAR(255),
    photographer_profile_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
);

-- //todo : table à compléter dans le cadre de la création de partitions + créer tables enfants (cf discussion gpt ExpressJS)
-- //note : mettre box_id et/ou creator_id en clé étrangère ? partitions sur quelle colonne : année, box_id, creator_id ? => adapter update_card_history.sql
-- CREATE TABLE "card_history" (
--     id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     card_id INTEGER NOT NULL REFERENCES "card"(id) ON DELETE CASCADE,
--     revision_count INTEGER NOT NULL DEFAULT 0,
--     compartment_from INTEGER NOT NULL,
--     compartment_to INTEGER NOT NULL,
--     action_type VARCHAR(10) NOT NULL,
--     action_date TIMESTAMPTZ NOT NULL DEFAULT now(),
--     updated_at TIMESTAMPTZ
-- );

CREATE TABLE "box_historical_stats" (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    box_id INTEGER NOT NULL REFERENCES "box"(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL DEFAULT (date_part('week', CURRENT_DATE)),
    year INTEGER NOT NULL DEFAULT (date_part('year', CURRENT_DATE)),
    total_cards INTEGER NOT NULL DEFAULT 0,
    compartment1 INTEGER NOT NULL DEFAULT 0,
    compartment2 INTEGER NOT NULL DEFAULT 0,
    compartment3 INTEGER NOT NULL DEFAULT 0,
    compartment4 INTEGER NOT NULL DEFAULT 0,
    compartment5 INTEGER NOT NULL DEFAULT 0,
    compartment6 INTEGER NOT NULL DEFAULT 0,
    compartment7 INTEGER NOT NULL DEFAULT 0,
    compartment8 INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
)

COMMIT;