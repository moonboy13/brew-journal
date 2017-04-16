--Some basic database setup functions.

--Create your database
CREATE DATABASE <insert_db>;

--Create some users. Obviously, swap out foobar with a more secure password
CREATE ROLE <insert_roll>;
CREATE USER <insert_user> WITH ENCRYPTED PASSWORD '<insert_pwd>';

--Format yo role for django
ALTER ROLE <insert_roll> SET client_encoding TO 'utf8';
ALTER ROLE <insert_roll> SET default_transaction_isolation TO 'read committed'; -- Default
ALTER ROLE <insert_roll> SET timezone TO 'UTC';

--Grant you users some permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO <insert_roll>;
GRANT <insert_roll> TO <insert_user>;

--For Django testing purposes, the created user you're connecing with needs the
--permission to create a DB so Django can run tests on an isolated DB.
ALTER USER <insert_user> CREATEDB;
