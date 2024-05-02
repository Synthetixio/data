# Extractors

This services makes use of [cryo](https://github.com/paradigmxyz/cryo) to extract data using `eth_call` RPC calls. This is required to fetch any data which can't be indexed from event logs. The extracted data is stored in the `parquet-data` directory, and will be imported into the Postgres database using the [Transformers](../transformers/) service.

## Usage

Start the extractor using a `make` command from the root directory.
```bash
## start the extractor
make extract

## import the parquet data into the database
make import
```

## Configuration

In order to prepare the data for these calls, the service uses the Synthetix [python-sdk](https://github.com/Synthetixio/python-sdk) and cryo. The `extractors/main.py` file contains a list of calls to be made. The process is as follows:
1. The Synthetix SDK will prepare the call data
1. The call data is passed to cryo to make the `eth_call` requests and store the data in the `parquet-data/raw/<network>` directory
1. The output data is decoded and cleaned using polars and duckdb, and stored in the `parquet-data/clean/<network>` directory

## Adding Calls

Each call is configured like so:
```python
{
    "network_id": 8453,
    "contract_name": "CoreProxy",
    "function_name": "getVaultDebt",
    "inputs": [
        (1, "0xC74eA762cF06c9151cE074E6a569a5945b6302E7"),
    ],
    "min_block": "7.5M",
    "requests_per_second": 25,
}
```

In order to succeed, the contract must be present in the Synthetix SDK. The contract and function names will be used to prepare the call data and to decode the result. The inputs are passed to the function as arguments. The `min_block` is used to filter out calls that are too old. The `requests_per_second` is used to throttle the requests to the node.
