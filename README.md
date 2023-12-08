# Data Stack

A collection of services to index, store, and transform data related to Synthetix smart contracts. A summary of each service is provided below. If you would like more information about running each of these services, visit the README in the respective directory.

## Services

* [**Database**](./postgres/) - A Postgres database used to store raw and transformed data.
* [**Indexers**](./indexers/) - Blockchain indexers using Subsquid archives to index Synthetix smart contracts. These indexers are used to populate a Postgres database with raw event log data.
* [**Transformers**](./transformers/) - Services that transform raw event log data into a format that is more useful for querying. These services are used to populate a Postgres database with transformed data using [dbt](https://www.getdbt.com/).
* [**Dashboard**](./dashboard/) - A collection of dashboards built using [streamlit](https://streamlit.io/) and connected directly to the Postgres database.
