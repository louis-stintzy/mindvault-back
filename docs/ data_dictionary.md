# Dictionnaire des données

## Table "user"

| Nom du champ  | Type           | Contraintes              | Description |
| :------------ |:---------------| :------------------------|:--------------- |
| id            | int            | PRIMARY KEY              | Identifiant unique de l'utilisateur |
| email         | VARCHAR(255)   | NOT NULL UNIQUE          | Adresse email unique de l'utilisateur pouvant servir à s'identifier |
| pwd           | CHAR(60)       | NOT NULL                 | Mot de passe (hashé) |
| username      | VARCHAR(50)    | NOT NULL UNIQUE          | Nom d'utilisateur, unique |
| user_picture  | VARCHAR(255)   |                          | Chemin vers la photo de profil   |
| app_role      | int            | NOT NULL DEFAULT 0       | Indique le rôle de l'utilisateur (0: pas de rôle, rôle à déterminer pour l'administrateur) |
| verified      | BOOLEAN        | NOT NULL DEFAULT false   | Indique si l'adresse mail a été vérifiée |
| created_at    | TIMESTAMPTZ    | NOT NULL DEFAULT now()   | date/heure de création |
| updated_at    | TIMESTAMPTZ    |                          | date/heure de la dernière mise à jour |

## Table "box"

| Nom du champ           | Type           | Contraintes     | Description |
| :----------------------|:---------------| :---------------|:--------------- |
| id                     | int            | PRIMARY KEY     | Identifiant unique de la box |
| #owner_id              | int            | NOT NULL FOREIGN KEY REFERENCES USER(id) | Identifiant du possesseur de la box |
| original_box_id        | int            | NOT NULL        | Identifiant de la box originale |
| original_box_creator_id| int            | NOT NULL        | Identifiant du créateur de la box originale |
| original_box_created_at| TIMESTAMPTZ    | NOT NULL        | Date/heure de création de la box originale |
| copy_box_id            | int            |                 | Identifiant de la box copiée (si box copiée) |
| copy_box_owner_id      | int            |                 | Identifiant du possesseur de la box copiée (si box copiée) |
| copy_box_created_at    | TIMESTAMPTZ    |                 | Date/heure de création de la box copiée (si box copiée) |
| history       | text           | NOT NULL                 | Indique en premier : identifiant de la box originale, identifiant du créateur de la box originale, date/heure de création de la box originale puis ajoute à chaque copie de la box (séparé d'un tiret) les identifiants des nouvelles box et des différents possesseurs ainsi que les dates de création des box copiées (IDBOX.IDUSER.CREATEDAT-IDBOX.IDUSER.CREATEDAT) |
| name          | VARCHAR(255)   | NOT NULL                 | Nom de la box |
| description   | text           |                          | Descriptif de la box |
| #picture_id    | int            |UNIQUE REFERENCES "picture"(id) ON DELETE SET NULL                          | Identifiant de l'illustration  |
| color         | VARCHAR(15)   |                           | Couleur associée à la box   |
| label         | VARCHAR(30)   |                           | Label (thématique) de la box   |
| level         | VARCHAR(30)   |                           | Niveau de difficulté des questions  |
| default_question_language      | VARCHAR(10)   | NOT NULL DEFAULT 'fr-FR' | langue par défaut des questions (utilisation du speech-to-text) |
| default_question_voice         | VARCHAR(255)  |                          | voix par défaut des questions (utilisation du speech-to-text)   |
| default_answer_language        | VARCHAR(10)   | NOT NULL DEFAULT 'fr-FR' | langue par défaut des réponses (utilisation du speech-to-text)  |
| default_answer_voice           | VARCHAR(255)  |                          | voix par défaut des réponses (utilisation du speech-to-text)    |
| position      | int            | NOT NULL                 | Position de la box dans la liste de boxes |
| learn_it      | BOOLEAN        | NOT NULL DEFAULT true    | Box en cours d'apprentissage  |
| type          | int            | NOT NULL DEFAULT 2       | 1: Box contenant d'autres box (Niveau 1) ; 2: Box ne contenant pas d'autres box, contenant seulement des cards (Niveau 1) ; 3: Box contenue dans une autre box et contenant des cards (Niveau 2) |
| #parent_box_id | int            | FOREIGN KEY REFERENCES BOX(id)                         | S'il s'agit d'une box contenue dans une autre box : identifiant de la box parente   |
| on_store   | int            | NOT NULL DEFAULT 0       | 0: privée, seul l'utilisateur possède la box, il peut la consulter ou la modifier; 1: public et non modifiable, l'utilisateur partage sa box en la dupliquant sur le store, les autres utilisateurs peuvent la récupérer en dupliquant la box du store (et bénéficier de mises à jour ?), ils ne peuvent pas la modifier ; 2: public et modifiable, l'utilisateur partage sa box en la dupliquant sur le store, les autres utilisateurs peuvent la dupliquer puis modifier leur nouvelle box |
| created_at    | TIMESTAMPTZ    | NOT NULL DEFAULT now()   | date/heure de création |
| updated_at    | TIMESTAMPTZ    |                          | date/heure de la dernière mise à jour |
<!-- //todo: supprimer | box_picture   | VARCHAR(255)   |                          | Chemin vers l'illustration de la box   | -->

## Table "card"

| Nom du champ  | Type           | Contraintes              | Description |
| :------------ |:---------------| :------------------------|:--------------- |
| id            | int            | PRIMARY KEY              | Identifiant unique de la card |
| #box_id       | int            | NOT NULL FOREIGN KEY REFERENCES BOX(id) ON DELETE CASCADE               | Identifiant de la box dans laquelle se situe la card |
| #creator_id   | int            | NOT NULL FOREIGN KEY REFERENCES USER(id)               | Identifiant du créateur de la card |
| question_language | VARCHAR(10)| NOT NULL DEFAULT 'fr-FR' | Langue utilisée pour la question |
| question_voice| VARCHAR(255)   |                          | Voix utilisée pour la question |
| answer_language   | VARCHAR(10)| NOT NULL DEFAULT 'fr-FR' | Langue utilisée pour la réponse |
| answer_voice  | VARCHAR(255)   |                          | Voix utilisée pour la réponse |
| question      | text           | NOT NULL                 | Question de la card |
| answer        | text           | NOT NULL                 | Réponse à la question de la card |
| attachment    | VARCHAR(255)   |                          | Chemin vers la pièce-jointe    |
| position      | int            | NOT NULL                 | Position de la card dans la liste de cards|
| compartment   | int            | NOT NULL                 | Compartiment fictif dans lequelle se situe la card (autrement dit : numéro de l'étape dans l'apprentissage de la card)   |
| date_to_ask   | TIMESTAMPTZ    | NOT NULL DEFAULT ADDDATE(now(), 1)           | Indique la date à laquelle sera posée la question |
| created_at    | TIMESTAMPTZ    | NOT NULL DEFAULT now()   | date/heure de création |
| updated_at    | TIMESTAMPTZ    |                          | date/heure de la dernière mise à jour |

<!-- | compartment_history   | INTEGER[]      | DEFAULT ARRAY[]::INTEGER[]           | Stocke la séquence des compartiments   |
| revision_count| int            | NOT NULL DEFAULT 0       | Compte combien de fois l'utilisateur a révisé la card      | -->

## Table "picture"

| Nom du champ  | Type           | Contraintes                                          | Description                             |
| :------------ |:---------------| :----------------------------------------------------|:----------------------------------------|
| id            | INTEGER        | GENERATED ALWAYS AS IDENTITY PRIMARY KEY             | Identifiant unique de l'illustration    |
| #user_id      | int            | FOREIGN KEY UNIQUE REFERENCES "user"(id) ON DELETE CASCADE   | Identifiant du user rattachée à la picture    |
| #box_id       | int            | FOREIGN KEY UNIQUE REFERENCES "box"(id) ON DELETE CASCADE    | Identifiant de la box rattachée à la picture  |
| #card_id      | int            | FOREIGN KEY UNIQUE REFERENCES "card""(id) ON DELETE CASCADE  | Identifiant de la card rattachée à la picture |
| picture_url                 | Text           | NOT NULL                                             | URL de l'image sur AWS S3               |
| photographer_name           | VARCHAR(255)   |                                                      | Nom du photographe                      |
| photographer_profile_url    | VARCHAR(255)   |                                                      | URL du profil du photographe            |
| created_at    | TIMESTAMPTZ    | NOT NULL DEFAULT now()                               | date/heure de création                  |
| updated_at    | TIMESTAMPTZ    |                                                      | date/heure de la dernière mise à jour   |

## Table "box_historical_stats"

| Nom du champ  | Type           | Contraintes              | Description |
| :------------ |:---------------| :------------------------|:--------------- |
| id            | INTEGER        | GENERATED ALWAYS AS IDENTITY PRIMARY KEY            | Identifiant unique des statistiques historiques de la box |
| box_id        | INTEGER        | NOT NULL FOREIGN KEY REFERENCES "box"(id) ON DELETE CASCADE | Identifiant de la box associée aux statistiques |
| week_number   | INTEGER        | NOT NULL DEFAULT (date_part('week', CURRENT_DATE))  | Numéro de la semaine de l'année pour laquelle les statistiques sont enregistrées |
| year          | INTEGER        | NOT NULL DEFAULT (date_part('year', CURRENT_DATE))  | Année pour laquelle les statistiques sont enregistrées |
| total_cards   | INTEGER        | NOT NULL DEFAULT 0                                  | Nombre total de cartes dans la box au moment de l'enregistrement |
| compartment1  | INTEGER        | NOT NULL DEFAULT 0                                  | Nombre de cartes dans le compartiment 1 au moment de l'enregistrement |
| compartment2  | INTEGER        | NOT NULL DEFAULT 0                                  | Nombre de cartes dans le compartiment 2 au moment de l'enregistrement |
| compartment3  | INTEGER        | NOT NULL DEFAULT 0                                  | Nombre de cartes dans le compartiment 3 au moment de l'enregistrement |
| compartment4  | INTEGER        | NOT NULL DEFAULT 0                                  | Nombre de cartes dans le compartiment 4 au moment de l'enregistrement |
| compartment5  | INTEGER        | NOT NULL DEFAULT 0                                  | Nombre de cartes dans le compartiment 5 au moment de l'enregistrement |
| compartment6  | INTEGER        | NOT NULL DEFAULT 0                                  | Nombre de cartes dans le compartiment 6 au moment de l'enregistrement |
| compartment7  | INTEGER        | NOT NULL DEFAULT 0                                  | Nombre de cartes dans le compartiment 7 au moment de l'enregistrement |
| compartment8  | INTEGER        | NOT NULL DEFAULT 0                                  | Nombre de cartes dans le compartiment 8 au moment de l'enregistrement |
| created_at    | TIMESTAMPTZ    | NOT NULL DEFAULT now()                              | Date et heure de création de l'enregistrement des statistiques |
| updated_at    | TIMESTAMPTZ    |                                                     | Date et heure de la dernière mise à jour de l'enregistrement des statistiques |