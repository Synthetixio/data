import clickhouse_connect
from clickhouse_connect.driver.asyncclient import AsyncClient
import argparse
import os
import asyncio
import time

BASE_PATH = "/var/lib/clickhouse/user_files/parquet-data-indexers"


def get_event_list(network: str) -> set[str]:
    event_list = set()
    for root, dirs, files in os.walk(f"/parquet-data-indexers/{network}"):
        for file in files:
            if file.endswith(".parquet"):
                event_name = file.split(".")[0]
                event_list.add(event_name)
    print(f"Found {len(event_list)} events for {network}")
    return event_list


async def create_table(
    client: AsyncClient,
    event_name: str,
    network: str,
):
    print(event_name)
    print(f"{BASE_PATH}/{network}/*/{event_name}.parquet")
    query = (
        f"create table if not exists {event_name}_{network} "
        f"engine = MergeTree order by tuple() as "
        f"select * from file('{BASE_PATH}/{network}/*/{event_name}.parquet')"
    )
    await client.command(query)


async def semaphore_wrapper(
    client: AsyncClient,
    sm: asyncio.Semaphore,
    event_name: str,
    network: str,
):
    print(event_name)
    print(f"{BASE_PATH}/{network}/*/{event_name}.parquet")
    async with sm:
        data = await client.query(
            f"select * from file('{BASE_PATH}/{network}/*/{event_name}.parquet', 'Parquet')"
        )
        await client.insert(
            f"{event_name}_{network}",
            data.result_rows,
            settings={"async_insert": 1, "wait_for_async_insert": 1},
        )


async def main(network: str):
    client = await clickhouse_connect.get_async_client(
        host="clickhouse", port=8123, user="default"
    )

    event_list = get_event_list(network)

    for event_name in event_list:
        await create_table(client, event_name, network)

    semaphore = asyncio.Semaphore(4)

    start_time = time.time()
    await asyncio.gather(
        *[
            semaphore_wrapper(client, semaphore, event_name, network)
            for event_name in event_list
        ]
    )
    end_time = time.time()
    print(f"Elapsed time: {end_time-start_time:.2f} seconds")


if __name__ == "__main__":
    arg = argparse.ArgumentParser()
    arg.add_argument("--network", type=str, required=True)
    args = arg.parse_args()
    asyncio.run(main(args.network))
