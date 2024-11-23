// components/SuccessRedirectHandler.tsx
import type { PropsWithChildren } from "react";
import { useSuccessRedirect } from "~/hooks/success-redirect";

type SuccessRedirectHandlerProps = PropsWithChildren<{
  onSuccess?: (message: string) => void;
  preserveSearchParams?: boolean;
}>;

export function SuccessRedirectHandler({
  children,
  onSuccess,
  preserveSearchParams,
}: SuccessRedirectHandlerProps) {
  useSuccessRedirect({ onSuccess, preserveSearchParams });

  return <>{children}</>;
}
