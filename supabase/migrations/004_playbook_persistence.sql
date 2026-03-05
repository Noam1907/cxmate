-- Migration 004: Add playbook column to journey_templates
-- Stores the generated playbook JSON alongside the journey.
-- One journey_template row = one journey + one playbook.

ALTER TABLE journey_templates
  ADD COLUMN IF NOT EXISTS playbook JSONB DEFAULT NULL;

COMMENT ON COLUMN journey_templates.playbook IS 'Generated playbook (recommendations) stored as JSONB. Null until playbook is generated.';
