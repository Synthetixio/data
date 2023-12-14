import plotly.express as px


## charts
def chart_bars(df, x_col, y_cols, title, color=None, bottom_legend=True):
    fig = px.bar(df, x=x_col, y=y_cols, title=title, color=color)
    fig.update_traces(hovertemplate=None)
    fig.update_layout(
        hovermode="x unified",
    )

    if bottom_legend:
        fig.update_layout(
            legend=dict(orientation="h", yanchor="bottom", xanchor="left", y=-0.4),
        )
    return fig


def chart_lines(df, x_col, y_cols, title, color=None, bottom_legend=True):
    fig = px.line(df, x=x_col, y=y_cols, title=title, color=color)
    fig.update_traces(hovertemplate=None)
    fig.update_layout(
        hovermode="x unified",
    )

    if bottom_legend:
        fig.update_layout(
            legend=dict(orientation="h", yanchor="bottom", xanchor="left", y=-0.4),
        )
    return fig


# with asset filter
def chart_asset_bars(df, asset, x_col, y_cols, title):
    fig = px.bar(df[df["asset"] == asset], x=x_col, y=y_cols, title=f"{title}: {asset}")
    fig.update_traces(hovertemplate=None)
    fig.update_layout(
        hovermode="x unified",
        legend=dict(orientation="h", yanchor="bottom", xanchor="left", y=-0.4),
    )
    return fig


def chart_asset_lines(df, asset, x_col, y_cols, title):
    fig = px.line(
        df[df["asset"] == asset],
        x=x_col,
        y=y_cols,
        line_shape="hv",
        title=f"{title}: {asset}",
    )
    fig.update_traces(hovertemplate=None)
    fig.update_layout(
        hovermode="x unified",
        legend=dict(orientation="h", yanchor="bottom", xanchor="left", y=-0.4),
    )
    return fig


def chart_asset_oi(df, asset):
    fig = px.area(
        df[df["asset"] == asset],
        x="date",
        y=["short_oi_pct", "long_oi_pct"],
        line_shape="hv",
        color_discrete_sequence=["red", "green"],
        title=f"Open Interest %: {asset}",
    )
    fig.update_traces(hovertemplate=None)
    fig.update_layout(
        hovermode="x unified",
        legend=dict(orientation="h", yanchor="bottom", xanchor="left", y=-0.4),
    )
    return fig


# with market filter
def chart_market_bars(df, asset, x_col, y_cols, title):
    fig = px.bar(
        df[df["market_symbol"] == asset], x=x_col, y=y_cols, title=f"{title}: {asset}"
    )
    fig.update_traces(hovertemplate=None)
    fig.update_layout(
        hovermode="x unified",
        legend=dict(orientation="h", yanchor="bottom", xanchor="left", y=-0.4),
    )
    return fig


def chart_market_lines(df, asset, x_col, y_cols, title):
    fig = px.line(
        df[df["market_symbol"] == asset],
        x=x_col,
        y=y_cols,
        line_shape="hv",
        title=f"{title}: {asset}",
    )
    fig.update_traces(hovertemplate=None)
    fig.update_layout(
        hovermode="x unified",
        legend=dict(orientation="h", yanchor="bottom", xanchor="left", y=-0.4),
    )
    return fig


def chart_market_oi(df, asset):
    fig = px.area(
        df[df["market_symbol"] == asset],
        x="updated_ts",
        y=["short_oi_pct", "long_oi_pct"],
        line_shape="hv",
        color_discrete_sequence=["red", "green"],
        title=f"Open Interest %: {asset}",
    )
    fig.update_traces(hovertemplate=None)
    fig.update_layout(
        hovermode="x unified",
        legend=dict(orientation="h", yanchor="bottom", xanchor="left", y=-0.4),
    )
    return fig
