CREATE OR REPLACE FUNCTION update_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.modified = now();
	RETURN NEW;
END;
$$ language 'plpgsql';