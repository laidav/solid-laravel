import { combine } from "@reactables/core";
import { RxAuth } from "./RxAuth";
import { AuthService } from "../Services/AuthService";

export const RxApp = ({
  authService,
}: {
  authService: ReturnType<typeof AuthService>;
}) => {
  return combine({
    auth: RxAuth({ authService }),
  });
};
