# Transformers

This package contains data transformations using [dbt](https://www.getdbt.com/).

## Installation

Create a virtual environment and install the dependencies:
```bash
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

## Usage

To run the transformations, you need to have a database and indexers running locally. See the [Indexers](../indexers/README.md) section for more information.

Before running dbt, you must make sure each of the subsquid indexer databases are connected to the `analytics` database. You can do this by running the following command:
```bash
cd synthetix

python scripts/wrap_tables.py
```

Then, you can run the transformations with:
```bash
dbt run --target base_goerli --profiles-dir profiles
```
