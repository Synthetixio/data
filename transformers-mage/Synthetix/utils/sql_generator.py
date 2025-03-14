def convert_wei(column_name):
    return f"{column_name} / 1e18"

def convert_hex(hex_column, max_length=20):
    return f"""
    LEFT(
        REGEXP_REPLACE(
            encode(
                DECODE(REPLACE({hex_column}, '0x', ''), 'hex'),
                'escape'
            ) :: text,
            '\\000',
            '',
            'g'
        ),
        {max_length}
    )
    """

def get_event_data(chain, network, contract_name, event_name):
    return f"""
    SELECT * FROM raw_{chain}_{network}.{contract_name}_event_{event_name}
    """