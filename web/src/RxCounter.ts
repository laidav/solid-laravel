import { RxBuilder } from "@reactables/core";

export const RxCounter = () =>
  RxBuilder({
    initialState: 0,
    reducers: {
      increment: (state) => state + 1,
    },
  });
