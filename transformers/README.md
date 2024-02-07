# Transformers

This services makes use of [dbt](https://www.getdbt.com/) to transform raw event log data into a format that is more useful for analytics and dashboards. The service is configured to run dbt for each of the networks that are indexed by the [indexers](../indexers/) service. The service will run dbt for each of the networks, and will create a set of tables and views in the `analytics` database.

## Usage

The most simple interface for running transformations is using `make` commands. See the [Makefile](../Makefile) in the root directory for the commands. The following commands are available:
```bash
## dbt operations
# build the transformations docker image
make build

# run dbt for all networks
make dbt

## Postgres operations
# wrap the raw tables from the indexers as foreign tables in the analytics database
make wrap

# drop and recreate a database
# this can be useful if you want to index from scratch
make recreate-db DB=base_sepolia

# reset the read-only user password
make reset-pw
```

## Models

Models are split into two categories: `raw` and `marts`. The `raw` models load event logs directly from the indexers without any transformations. Models in the `marts` directory combine and transform data from the `raw` models into a format that is more useful for analytics and dashboards. The `marts` models are the ones that are used by the [dashboards](../dashboards/) service.
