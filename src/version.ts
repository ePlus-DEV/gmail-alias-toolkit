import packageMetadata from "../package.json";

const injectedVersion = import.meta.env.VITE_APP_VERSION?.trim();

/** Application version from the web build or root package metadata. */
export const APP_VERSION = injectedVersion || packageMetadata.version;
