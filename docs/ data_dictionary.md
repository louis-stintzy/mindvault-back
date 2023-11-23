# Dictionnaire des données

## Table USER

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

## Table BOX

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
| box_picture   | VARCHAR(255)   |                          | Chemin vers la photo de profil   |
| color         | VARCHAR(15)   |                          | Couleur associée à la box   |
| label         | VARCHAR(30)   |                          | Label (thématique) de la box   |
| level         | VARCHAR(30)   |                          | Niveau de difficulté des questions  |
| position      | int            | NOT NULL                 | Position de la box dans la liste de boxes |
| learn_it      | BOOLEAN        | NOT NULL DEFAULT true    | Box en cours d'apprentissage  |
| type          | int            | NOT NULL DEFAULT 2       | 1: Box contenant d'autres box (Niveau 1) ; 2: Box ne contenant pas d'autres box, contenant seulement des cards (Niveau 1) ; 3: Box contenue dans une autre box et contenant des cards (Niveau 2) |
| #parent_box_id | int            | FOREIGN KEY REFERENCES BOX(id)                         | S'il s'agit d'une box contenue dans une autre box : identifiant de la box parente   |
| on_store   | int            | NOT NULL DEFAULT 0       | 0: privée, seul l'utilisateur possède la box, il peut la consulter ou la modifier; 1: public et non modifiable, l'utilisateur partage sa box en la dupliquant sur le store, les autres utilisateurs peuvent la récupérer en dupliquant la box du store (et bénéficier de mises à jour ?), ils ne peuvent pas la modifier ; 2: public et modifiable, l'utilisateur partage sa box en la dupliquant sur le store, les autres utilisateurs peuvent la dupliquer puis modifier leur nouvelle box |
| created_at    | TIMESTAMPTZ    | NOT NULL DEFAULT now()   | date/heure de création |
| updated_at    | TIMESTAMPTZ    |                          | date/heure de la dernière mise à jour |

## Table CARD

| Nom du champ  | Type           | Contraintes              | Description |
| :------------ |:---------------| :------------------------|:--------------- |
| id            | int            | PRIMARY KEY              | Identifiant unique de la card |
| #box_id       | int            | NOT NULL FOREIGN KEY REFERENCES BOX(id)               | Identifiant de la box dans laquelle se situe la card |
| #creator_id   | int            | NOT NULL FOREIGN KEY REFERENCES USER(id)               | Identifiant du créateur de la card |
| question      | text           | NOT NULL                 | Question de la card |
| answer        | text           | NOT NULL                 | Réponse à la question de la card |
| attachment    | VARCHAR(255)   |                          | Chemin vers la pièce-jointe    |
| position      | int            | NOT NULL                 | Position de la card dans la liste de cards|
| compartment   | int            | NOT NULL                 | Compartiment fictif dans lequelle se situe la card (autrement dit : numéro de l'étape dans l'apprentissage de la card)   |
| date_to_ask   | TIMESTAMPTZ    | NOT NULL DEFAULT ADDDATE(now(), 1)           | Indique la date à laquelle sera posée la question |
| created_at    | TIMESTAMPTZ    | NOT NULL DEFAULT now()   | date/heure de création |
| updated_at    | TIMESTAMPTZ    |                          | date/heure de la dernière mise à jour |
