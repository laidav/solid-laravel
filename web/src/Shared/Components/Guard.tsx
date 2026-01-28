import { Navigate } from "@solidjs/router";
import type { JSX, Accessor } from "solid-js";

type GuardProps = {
  children: JSX.Element;
  when: boolean | Accessor<boolean>;
  redirectTo: string;
};

const Guard = (props: GuardProps) => {
  const allowed = () =>
    typeof props.when === "function" ? props.when() : props.when;

  return allowed() ? props.children : <Navigate href={props.redirectTo} />;
};

export default Guard;
