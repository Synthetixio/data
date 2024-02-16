import plotly.express as px

## color sets
sequential = [
    "#E5FAFF",
    "#B7F2FF",
    "#8AEAFF",
    "#5CE1FF",
    "#2FD9FF",
    "#00D1FF",
    "#00B0D6",
    "#006D85",
    "#004B5C",
]
categorical = ["#00D1FF", "#EB46FF", "#6B59FF", "#4FD1C5", "#1F68AC", "#FDE8FF"]


## charts
def chart_many_bars(df, x_col, y_cols, title, color=None, y_format="$"):
    fig = px.bar(
        df,
        x=x_col,
        y=y_cols,
        title=title,
        color=color,
        color_discrete_sequence=categorical,
        template="plotly_dark",
    )

    # remove axis labels
    fig.update_xaxes(
        title_text="",
        automargin=True,
    )
    fig.update_yaxes(title_text="")

    # format the y-axis
    if y_format == "%":
        fig.update_yaxes(tickformat=".2%")
    elif y_format == "$":
        fig.update_yaxes(tickprefix="$")
    elif y_format == "#":
        fig.update_yaxes(tickprefix=None)

    fig.update_layout(
        font=dict(
            family="sans-serif",
        ),
    )
    return fig


def chart_many_pct(df, x_col, y_cols, title, color=None):
    fig = px.area(df, x=x_col, y=y_cols, title=title, color=color, groupnorm="percent")
    fig.update_layout(
        hovermode="x unified",
    )
    fig.update_traces(hovertemplate=None)
    return fig


def chart_many_lines(df, x_col, y_cols, title, color=None):
    fig = px.line(df, x=x_col, y=y_cols, title=title, color=color)
    return fig


def chart_bars(df, x_col, y_cols, title, color=None, y_format="$"):
    fig = px.bar(
        df,
        x=x_col,
        y=y_cols,
        title=title,
        color=color,
        color_discrete_sequence=categorical,
        template="plotly_dark",
    )

    # remove axis labels
    fig.update_xaxes(
        title_text="",
        automargin=True,
    )
    fig.update_yaxes(title_text="")
    fig.update_traces(hovertemplate=None)

    # format the y-axis
    if y_format == "%":
        fig.update_yaxes(tickformat=".2%")
    elif y_format == "$":
        fig.update_yaxes(tickprefix="$")
    elif y_format == "#":
        fig.update_yaxes(tickprefix=None)

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


def chart_lines(df, x_col, y_cols, title, color=None, smooth=False, y_format="$"):
    fig = px.line(
        df,
        x=x_col,
        y=y_cols,
        title=title,
        color=color,
        color_discrete_sequence=categorical,
        template="plotly_dark",
    )

    fig.update_traces(
        hovertemplate=None,
        line_shape=None if smooth else "hv",
    )

    # remove axis labels
    fig.update_xaxes(
        title_text="",
        automargin=True,
    )
    fig.update_yaxes(title_text="")

    # format the y-axis
    if y_format == "%":
        fig.update_yaxes(tickformat=".2%")
    elif y_format == "$":
        fig.update_yaxes(tickprefix="$")
    elif y_format == "#":
        fig.update_yaxes(tickprefix=None)

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


def chart_oi(df, x_col, title):
    fig = px.area(
        df,
        x=x_col,
        y=["short_oi_pct", "long_oi_pct"],
        line_shape="hv",
        color_discrete_sequence=["red", "green"],
        title=title,
    )

    # remove axis labels
    fig.update_traces(hovertemplate=None)
    fig.update_xaxes(
        title_text="",
        automargin=True,
    )
    fig.update_yaxes(title_text="", tickformat=".0%")

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


def chart_oi(df):
    fig = px.area(
        df,
        x="ts",
        y=["short_oi_pct", "long_oi_pct"],
        line_shape="hv",
        color_discrete_sequence=["red", "green"],
        title=f"Open Interest (%)",
    )
    fig.update_traces(hovertemplate=None)
    fig.update_layout(
        hovermode="x unified",
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    )
    return fig
