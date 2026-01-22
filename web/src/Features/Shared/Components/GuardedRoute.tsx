import { Route, Navigate } from "@solidjs/router";
import type { Component, Accessor } from "solid-js";

type GuardedRouteProps = {
  path: string;
  component: Component;
  when: boolean | Accessor<boolean>;
  redirectTo: string;
};

export const GuardedRoute = (props: GuardedRouteProps) => {
  const allowed = () =>
    typeof props.when === "function" ? props.when() : props.when;

  return (
    <Route
      path={props.path}
      component={() =>
        allowed() ? <props.component /> : <Navigate href={props.redirectTo} />
      }
    />
  );
};
