import type { RegisteredComponent } from "@builder.io/sdk-react";
import LoginButton from "./LoginButton";

export const loginButtonConfig: RegisteredComponent = {
  component: LoginButton,
  name: "LoginButton",
  inputs: [{ name: "label", type: "string", defaultValue: "Log in" }],
};
