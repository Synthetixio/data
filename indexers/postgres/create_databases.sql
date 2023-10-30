CREATE DATABASE base_goerli; -- raw events from Base Goerli
CREATE DATABASE optimism_goerli; -- raw events from Optimism Goerli
CREATE DATABASE optimism_mainnet; -- raw events from Optimism Mainnet
CREATE DATABASE analytics; -- transformed data from dbt

-- Set up to copy tables in DBT
\c analytics;

CREATE EXTENSION IF NOT EXISTS dblink;

CREATE OR REPLACE PROCEDURE copy_schema_tables(
    source_dbname VARCHAR, source_schema VARCHAR,
    target_dbname VARCHAR, target_schema VARCHAR
)
LANGUAGE plpgsql AS $$
DECLARE
    v_table_name VARCHAR;
    v_column_record RECORD;
    source_connstr text;
    target_connstr text;
    column_definitions text;
    query text;
BEGIN
    -- Construct the connection strings
    source_connstr := format('host=localhost dbname=%s user=postgres password=postgres', source_dbname);
    target_connstr := format('host=localhost dbname=%s user=postgres password=postgres', target_dbname);

    -- Create target schema if it does not exist in the target database
    EXECUTE format('SELECT dblink_exec(%L, %L)', target_connstr, 'CREATE SCHEMA IF NOT EXISTS ' || quote_ident(target_schema));

    -- Iterate over each table in the source schema
    FOR v_table_name IN (SELECT table_name FROM dblink(source_connstr, format('SELECT table_name FROM information_schema.tables WHERE table_schema = %L AND table_type = %L', source_schema, 'BASE TABLE')) AS t1(table_name text))
    LOOP
        -- Reset column_definitions for each table
        column_definitions := '';

        -- Get the column definitions for the current table from the source database
        FOR v_column_record IN (SELECT * FROM dblink(source_connstr, format('SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = %L AND table_name = %L', source_schema, v_table_name)) AS t(column_name text, data_type text))
        LOOP
            -- Append to column_definitions with proper formatting
            column_definitions := column_definitions || quote_ident(v_column_record.column_name) || ' ' || v_column_record.data_type || ', ';
        END LOOP;

        -- Remove trailing comma and space
        column_definitions := rtrim(column_definitions, ', ');

        -- Construct the dynamic SQL to copy the table
        query := format('CREATE TABLE IF NOT EXISTS %I.%I AS SELECT * FROM dblink(%L, %L) AS t(%s)', target_schema, v_table_name, source_connstr, 'SELECT * FROM ' || quote_ident(source_schema) || '.' || quote_ident(v_table_name), column_definitions);

        -- Execute the query in the target database
        EXECUTE format('SELECT dblink_exec(%L, %L)', target_connstr, query);
    END LOOP;

    RAISE NOTICE 'Tables from %.% have been copied to %.%', source_dbname, source_schema, target_dbname, target_schema;
END;
$$;