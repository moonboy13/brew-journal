CREATE TABLE "user" (
	user_id    serial                NOT NULL,
	"name"     character varying(20) NOT NULL,
	"password" character varying(32) NOT NULL,
	status     boolean               DEFAULT 't',
	created    timestamp             DEFAULT now(),
	modified   timestamp             DEFAULT now(),
	CONSTRAINT user_pkey PRIMARY KEY (user_id)
);

-- Create the function to handle updating the modified timestamp
CREATE TRIGGER
	modify_user_modtime
BEFORE UPDATE ON
	"user"
FOR EACH ROW EXECUTE PROCEDURE
	update_modified_timestamp();