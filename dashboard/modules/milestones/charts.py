from datetime import timedelta
from utils import categorical
import plotly.express as px
import plotly.graph_objects as go
from utils import chart_lines


def chart_volume(df):
    fig = px.bar(
        df,
        x="ts",
        y="volume",
        title="Base Andromeda Perps Volume",
        color_discrete_sequence=categorical,
        template="plotly_dark",
    )

    # add the 7 day avg line
    fig.add_trace(
        go.Scatter(
            x=df["ts"],
            y=df["volume_7d"],
            mode="lines",
            line=dict(color=categorical[1]),
            name="7d Avg Volume",
        )
    )

    # set the y axis max to 110 million
    fig.update_yaxes(range=[0, 110000000])

    # add a horizontal line at 100 million
    fig.add_shape(
        dict(
            type="line",
            x0=df["ts"].min() - timedelta(days=1),
            x1=df["ts"].max() + timedelta(days=1),
            y0=100000000,
            y1=100000000,
            line=dict(color="red", width=2),
        )
    )

    # remove axis labels
    fig.update_xaxes(
        title_text="",
        automargin=True,
    )
    fig.update_yaxes(title_text="")
    fig.update_traces(hovertemplate=None)
    fig.update_yaxes(tickprefix="$")

    # Update layout for dark theme readability
    fig.update_layout(
        hovermode="x unified",
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            title=None,
        ),
        font=dict(
            family="sans-serif",
        ),
    )
    return fig


def chart_collateral(df):
    fig = chart_lines(
        df,
        "ts",
        ["collateral_value"],
        "Base Andromeda LP Collateral",
        smooth=True,
    )

    # set the y axis max to 11 million
    fig.update_yaxes(range=[0, 11000000])

    # add a horizontal line at 10 million
    fig.add_shape(
        dict(
            type="line",
            x0=df["ts"].min() - timedelta(days=1),
            x1=df["ts"].max() + timedelta(days=1),
            y0=10000000,
            y1=10000000,
            line=dict(color="red", width=2),
        )
    )

    return fig
