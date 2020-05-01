import * as React from "react";
import StatusLine from "./StatusLine";

export default { title: "Dashboard - StatusLine" };

export const withDefault = () => (
  <StatusLine
    name={"status line"}
    status={"unknown"}
  />
);
