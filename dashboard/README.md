# Dashboard

The dashboard service provides a suite of dashboards using [streamlit](https://streamlit.io/). The dashboards are designed to use the data marts created by the [transformers](../transformers/) service. 

## Usage

The service runs as a docker container, and is started along with the other services in the `docker compose` setup. The dashboard is available at the port set by the `DASHBOARD_PORT` environment variable, which defaults to `8501`.

## Secrets

The `secrets_default.toml` file contains default environment variables for this services. To override the defaults, create a `secrets.toml` file at `.streamlit/secrets.toml` and add the environment variables you want to override. Then, update the `docker-compose.yml` file to mount the secrets file as a volume. Learn more about streamlit secrets [here](https://docs.streamlit.io/library/advanced-features/secrets-management).

## Development

The dashboard service consists of a page in the `pages` directory which corresponds to a network (OP mainnet, Base Goerli, Base Mainnet, etc.) Each page is set up to import a set of modules from the `modules` directory. To add new modules:

1. Create a new python file in the `modules` directory for the corresponding network
1. Import the module in the `pages` file for the corresponding network
1. Add the module to the `pages` dictionary for that page

