import * as React from "react";
import { addDecorator } from "@storybook/react";
import GlobalStyle from "../src/GlobalStyle";

addDecorator((storyFn) => <GlobalStyle>{storyFn()}</GlobalStyle>);
