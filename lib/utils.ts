import { useEffect, useLayoutEffect } from "react";

import * as constants from "./constants";
import { SessionDescriptor } from "./types";


export function makeNewSession(sid = "") {
  const session: SessionDescriptor = {
    sid,
    selections: {},
  };

  return session;
}

export function markVariantInSession(
  session: SessionDescriptor,
  site: string, experiment: string,
  variant: string) {

  let sites = session.selections;
  if (!sites) {
    sites = session.selections = {};
  }

  let experiments = sites[site];
  if (!experiments) {
    experiments = sites[site] = {
      [experiment]: [],
    };
  }

  let variants = experiments[experiment];
  if (!exists(variants)) {
    variants = experiments[experiment] = [];
  }

  // Put the most recently presented variant at the end
  const ix = variants.indexOf(variant);
  if (ix > -1) {
    variants.splice(ix, 1);
  }

  variants.push(variant);
}

/**
 * Freezes an entire object tree
 * @param obj 
 * @returns 
 */
export function deepFreeze<T extends object>(obj: T, seen = new WeakMap<T, boolean>()) {
  if (!exists(obj)) {
    return obj;
  }

  seen.set(obj, true);

  Object.getOwnPropertyNames(obj)
    .filter(prop => !seen.has(obj[prop]))
    .filter(prop => obj[prop] && typeof obj[prop] === "object")
    .forEach(prop => deepFreeze(obj[prop], seen));

  return Object.freeze<T>(obj);
}

/**
 * Returns `true` if something is non-null and non-undefined
 * @param thing 
 * @returns 
 */
export function exists<T>(thing: T): thing is NonNullable<T> {
  return (thing !== null && thing !== undefined);
}

/**
 * Pulls an environment variable either from a server environment
 * or from Next.js' public env vars exposed to the client.
 * @param name 
 * @returns 
 */
export function env(name: string): string | undefined {
  if (typeof process === "undefined") {
    return undefined;
  } else if (isBrowserEnvironment) {
    return process.env[constants.NEXTJS_PUBLIC_PREFIX + name];
  } else {
    return process.env[name];
  }
}

/**
 * Extracts a cookie by name from a request header value
 * @param cookieName 
 * @param str 
 * @returns 
 */
export function getCookie(cookieName, str = ""): string | null {
  let fullStr = "";
  if (typeof document === "undefined" && str === "") {
    return null;
  } else if (str !== "") {
    fullStr = str;
  } else {
    fullStr = document.cookie;
  }

  const cookie = fullStr
    .split(";")
    .map(cookie => cookie.trim())
    .filter(cookie => cookie.indexOf(cookieName) === 0)
    .map(cookie => cookie.substring(cookieName.length + 1, cookie.length))
    .pop();

  return cookie ?? null;
}

/**
 * Gets the base URL, observing environment variables if in a Node environment
 * @returns 
 */
export function getBaseUrl() {
  return env(constants.VARNAME_BASE_URL) ?? constants.DEFAULT_BASE_URL;
}

export const isBrowserEnvironment =
  typeof window !== "undefined";

export const useIsomorphicLayoutEffect =
  isBrowserEnvironment ? useLayoutEffect : useEffect;

export const flushPromises = async () => new Promise((resolve) => { scheduler(resolve); });
const scheduler = typeof setImmediate === "function" ? setImmediate : setTimeout;
