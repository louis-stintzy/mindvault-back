 -- Description: Cette fonction stocke les statistiques hebdomakdaires des boîtes de cartes dans la table historical_stats.
 -- CREATE FUNCTION est utilisé pour définir une nouvelle fonction.
 -- RETURNS void signifie que la fonction ne renvoie rien.
 -- AS introduit le corps de la fonction
 -- $$ est un délimiteur de texte pour les fonctions plpgsql.
 -- BEGIN ouvre le bloc de code de la fonction. END ferme le bloc de code de la fonction.
 -- LANGUAGE plpgsql indique que la fonction est écrite en plpgsql.

CREATE OR REPLACE FUNCTION collect_historical_stats() RETURNS void AS $$
BEGIN
  INSERT INTO box_historical_stats (box_id, total_cards, compartment1, compartment2, compartment3, compartment4, compartment5, compartment6, compartment7, compartment8)
  SELECT
    box_id,
    COUNT(*) AS total_cards,
    COUNT(*) FILTER (WHERE compartment = 1) AS compartment1,
    COUNT(*) FILTER (WHERE compartment = 2) AS compartment2,
    COUNT(*) FILTER (WHERE compartment = 3) AS compartment3,
    COUNT(*) FILTER (WHERE compartment = 4) AS compartment4,
    COUNT(*) FILTER (WHERE compartment = 5) AS compartment5,
    COUNT(*) FILTER (WHERE compartment = 6) AS compartment6,
    COUNT(*) FILTER (WHERE compartment = 7) AS compartment7,
    COUNT(*) FILTER (WHERE compartment = 8) AS compartment8
  FROM card
  GROUP BY box_id;
END;
$$ LANGUAGE plpgsql;

-- Description: Cette tâche cron planifie l'exécution de la fonction collect_historical_stats chaque dimanche à minuit.
-- SELECT cron.schedule est utilisé pour planifier une tâche cron.
-- 'weekly-stats-collection' est le nom de la tâche cron.
-- '0 0 * * 0' est la syntaxe cron pour exécuter la tâche chaque dimanche à minuit.
-- CALL collect_historical_stats() est la fonction à exécuter.

SELECT cron.schedule(
  'weekly-stats-collection',
  --   '0 0 * * 0', -- Chaque dimanche à minuit
  '5 14 * * 6', -- Test : “At 14:05 on Saturday.”
  'SELECT collect_historical_stats();'
);