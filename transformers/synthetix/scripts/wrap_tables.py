import os
import psycopg2

PG_PASSWORD = os.environ["PG_PASSWORD"]


def setup_fdw(cursor, server_name, local_db_params, remote_db_params):
    # Create the postgres_fdw extension if it doesn't exist
    cursor.execute("CREATE EXTENSION IF NOT EXISTS postgres_fdw;")

    # Create the foreign server
    cursor.execute(
        f"""
        DROP SERVER IF EXISTS {server_name} CASCADE;
        CREATE SERVER {server_name}
        FOREIGN DATA WRAPPER postgres_fdw
        OPTIONS (dbname '{remote_db_params['dbname']}');
    """
    )

    # Create a user mapping for the local user to the foreign server
    cursor.execute(
        f"""
        CREATE USER MAPPING FOR {local_db_params['user']}
        SERVER {server_name}
        OPTIONS (user '{local_db_params['user']}', password '{local_db_params['password']}');
    """
    )


def create_foreign_tables(database_name, db_params, source_schema="public"):
    # create variables
    target_schema = f"raw_{database_name}"
    server_name = f"{database_name}_server"

    # set up local connection
    local_db_params = db_params.copy()
    local_db_params["dbname"] = "analytics"

    local_conn = psycopg2.connect(**local_db_params)
    local_cursor = local_conn.cursor()

    # set up remote connection
    remote_db_params = db_params.copy()
    remote_db_params["dbname"] = database_name

    remote_conn = psycopg2.connect(**remote_db_params)
    remote_cursor = remote_conn.cursor()

    create_foreign_table_sql = """
    CREATE FOREIGN TABLE IF NOT EXISTS {target_schema}.{table_name} (
        {columns}
    ) SERVER {server_name}
    OPTIONS (schema_name '{source_schema}', table_name '{table_name}');
    """

    try:
        # Set up the FDW and server
        setup_fdw(local_cursor, server_name, local_db_params, remote_db_params)

        # Get the list of tables and their column definitions from the source schema
        remote_cursor.execute(
            f"""
            SELECT table_name, string_agg('"' || column_name || '"' || ' ' || data_type, ', ') as columns
            FROM information_schema.columns
            WHERE table_schema = '{source_schema}'
            GROUP BY table_name;
        """
        )

        tables = remote_cursor.fetchall()

        # Create the schema
        local_cursor.execute(
            f"""
           CREATE SCHEMA IF NOT EXISTS {target_schema};
        """
        )

        # Create foreign tables in the target schema
        for table in tables:
            table_name, columns = table

            sql = create_foreign_table_sql.format(
                target_schema=target_schema,
                table_name=table_name,
                columns=columns,
                server_name=server_name,
                source_schema=source_schema,
            )
            local_cursor.execute(sql)

        local_conn.commit()
        local_cursor.close()

        remote_conn.commit()
        remote_cursor.close()
        print(f"{database_name} foreign tables created successfully.")
    except Exception as e:
        print("An error occurred:", e)
    finally:
        local_conn.commit()
        local_cursor.close()

        remote_conn.commit()
        remote_cursor.close()


# Database connection parameters for the local database
db_params = {"host": "db", "port": 5432, "user": "postgres", "password": PG_PASSWORD}

create_foreign_tables("eth_mainnet", db_params)
create_foreign_tables("optimism_mainnet", db_params)
create_foreign_tables("base_sepolia", db_params)
create_foreign_tables("base_mainnet", db_params)
create_foreign_tables("arbitrum_sepolia", db_params)
create_foreign_tables("arbitrum_mainnet", db_params)
