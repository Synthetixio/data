# Transformers

This services makes use of [dbt](https://www.getdbt.com/) to transform raw event log data into a format that is more useful for analytics and dashboards. The service is configured to run dbt for each of the networks that are indexed by the [indexers](../indexers/) service. The service will run dbt for each of the networks, and will create a set of tables and views in the `analytics` database.
