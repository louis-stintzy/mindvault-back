-- Description : Cette fonction met à jour l'historique des cartes à chaque modification d'une carte (voir le déclencheur trigger_update_card_history).
-- CREATE FUNCTION est utilisé pour définir une nouvelle fonction.
-- RETURNS TRIGGER : façon de dire que cette fonction est destinée à être utilisée comme une fonction de trigger.
-- AS $$ : est utilisé pour délimiter le corps d'une fonction ou d'une commande qui doit être interprétée comme une chaîne de caractères
-- BEGIN ouvre le bloc de code de la fonction. END ferme le bloc de code de la fonction.
-- IF TG_OP = 'UPDATE' THEN : vérifie si le type d'opération de déclenchement est une mise à jour.
-- RETURN NEW :  dans un trigger AFTER UPDATE signifie que le trigger reconnaît que la mise à jour a déjà eu lieu (puisque c'est un AFTER trigger), et il indique simplement que le processus du trigger s'est terminé sans chercher à modifier ou à annuler l'opération de mise à jour de la table originale. Dans ce cas, RETURN NEW;
-- RETURN NULL : dans le contexte d'un trigger AFTER UPDATE indique simplement que la fonction de trigger a terminé son exécution et que, puisque c'est un trigger AFTER, il n'y a pas de modification ultérieure à appliquer à la ligne mise à jour dans la table card
-- $$ : Entre les deux délimiteurs $$, code SQL, PL/pgSQL ; est utilisé pour indiquer la fin du bloc de code ou de la chaîne
-- LANGUAGE plpgsql : indique que la fonction est écrite en plpgsql.

CREATE OR REPLACE FUNCTION update_card_history() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO card_history (card_id, revision_count, compartment_from, compartment_to, action_type, action_date)
        VALUES (NEW.id, OLD.revision_count +1, OLD.compartment, NEW.compartment,
          CASE
              WHEN OLD.compartment < NEW.compartment THEN 'success'
              ELSE 'failure'
          END,
          NOW());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;

$$ LANGUAGE plpgsql;

-- Description : Ce déclencheur appelle la fonction update_card_history à chaque mise à jour d'une carte (lorsque le compartiment est modifié).
-- FOR EACH ROW : "obligatoire", spécifie que le trigger doit être exécuté pour chaque ligne affectée par l'opération de mise à jour
-- WHEN... : le trigger s'active uniquement si la valeur de la colonne compartment a changé à la suite de la mise à jour.

CREATE TRIGGER trigger_update_card_history
AFTER UPDATE ON card
FOR EACH ROW
WHEN (OLD.compartment IS DISTINCT FROM NEW.compartment)
EXECUTE FUNCTION update_card_history();