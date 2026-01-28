import { type ActionObservableWithTypes } from "@reactables/core";
import { useRxApp } from "../Components/RxAppProvider";
import { take } from "rxjs/operators";
import { useNavigate } from "@solidjs/router";

export const useNavigateOnAction = (
  config: { on: string; navigateTo: string; callback?: () => void }[],
  actions$?: ActionObservableWithTypes<any>,
) => {
  actions$ = actions$ || useRxApp()[2];
  const navigate = useNavigate();

  config.forEach(({ on, navigateTo, callback }) => {
    actions$
      .ofTypes([on])
      .pipe(take(1))
      .subscribe(() => {
        callback && callback();
        navigate(navigateTo);
      });
  });
};
