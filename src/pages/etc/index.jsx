import React from "react";
import { Link } from "react-router-dom";

export default function ETC() {
    return (
        <div>
            <h1>Other stuff</h1>
            <Link to="/INF3012S" style={{
                display: "block",
                marginBottom: "1em",
                color: "blue",
                textDecoration: "underline",
                margin: "1em 0"
            }}>View my INF3012S Notes</Link>
        </div>
    );
}