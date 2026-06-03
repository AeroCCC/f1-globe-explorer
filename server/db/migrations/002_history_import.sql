ALTER TABLE races
  DROP CONSTRAINT IF EXISTS races_circuit_id_season_key;

CREATE UNIQUE INDEX IF NOT EXISTS races_circuit_season_round_unique
  ON races (circuit_id, season, round);
