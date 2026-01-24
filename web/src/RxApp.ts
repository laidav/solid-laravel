import { combine } from "@reactables/core";
import { RxAuth } from "./Features/Auth/RxAuth";
import { AuthService } from "./Services/authService";

export const RxApp = ({
  authService,
}: {
  authService: ReturnType<typeof AuthService>;
}) => {
  return combine({
    auth: RxAuth({ authService }),
  });
};
