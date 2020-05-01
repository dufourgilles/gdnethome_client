import * as React from "react";
import { withKnobs, text, number } from "@storybook/addon-knobs";
import WallSwitch from "./WallSwitch";

export default { title: "Dashboard - WallSwitch", decorators: [withKnobs] };

export const withDefault = () => (
  <WallSwitch
    name={text("Name", "Couloir")}
    onClick={() => {}}
    value={number("Value", 0)}
  />
);
