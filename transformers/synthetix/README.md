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

Then, you can run the transformations with:
```bash
cd synthetix

# Run all transformations
dbt run-operation copy_raw --profiles-dir profiles
dbt run --profiles-dir profiles
```


