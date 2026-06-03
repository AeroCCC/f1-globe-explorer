ALTER TABLE circuits
  ADD COLUMN IF NOT EXISTS season_round INTEGER;

CREATE INDEX IF NOT EXISTS idx_circuits_current_round
  ON circuits (is_current_season DESC, season_round);
