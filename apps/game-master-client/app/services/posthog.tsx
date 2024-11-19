import posthog from "posthog-js";
import { useEffect } from "react";

export function PosthogInit() {
  useEffect(() => {
    posthog.init(config.key, {
      api_host: "https://eu.i.posthog.com",
      person_profiles: "always", // or 'always' to create profiles for anonymous users as well
    });
  }, []);

  return null;
}

const config = {
  key: "phc_v8ewJ5PmanChrDsvVEFeVcfQ3sEY7FuZ1ao3udSmaUS",
};
