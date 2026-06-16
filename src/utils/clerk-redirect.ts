export const buildClerkRedirectProps = (returnTo: string) => ({
  forceRedirectUrl: returnTo,
  signUpForceRedirectUrl: returnTo,
  fallbackRedirectUrl: returnTo,
  signUpFallbackRedirectUrl: returnTo,
});

export const currentReturnTo = (pathname: string, search: string) =>
  `${pathname}${search}`;
