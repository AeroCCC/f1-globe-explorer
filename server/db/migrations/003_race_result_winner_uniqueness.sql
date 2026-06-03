ALTER TABLE race_results
  DROP CONSTRAINT IF EXISTS race_results_race_id_driver_name_position_key;

CREATE UNIQUE INDEX IF NOT EXISTS race_results_race_position_unique
  ON race_results (race_id, position);
