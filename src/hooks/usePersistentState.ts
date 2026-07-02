import { useEffect, useRef, useState } from "react";
import { versionedKey } from "@/lib/appVersion";

export function usePersistentState<T>(key: string, initial: T) {
  // Each app version (/v1 | /v2 | /v3) persists under its own namespace ("v2:clients")
  // so the versions evolve independently from the same INITIAL_* fixtures.
  const storageKey = versionedKey(key);
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  // Skip the FIRST (mount) write: the value is either already in storage (just read) or
  // the unmodified INITIAL_* default — and persisting a large default (e.g. the 8k-project
  // or 1.8k-store bulk catalogs) needlessly burns the ~5MB localStorage quota, which then
  // breaks scenario generation and silently drops edits. Readers fall back to INITIAL_*
  // when the key is absent, so nothing is lost; real changes (after mount) persist normally.
  const mounted = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* ignore quota / serialization errors */
    }
  }, [storageKey, value]);

  return [value, setValue] as const;
}

/** Like usePersistentState but backed by sessionStorage — survives navigation and
 *  reloads within the tab, and is cleared when the tab/session closes. Use for
 *  ephemeral UI state (e.g. filters) that should persist for the session only. */
export function useSessionState<T>(key: string, initial: T) {
  const storageKey = versionedKey(key);
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.sessionStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* ignore quota / serialization errors */
    }
  }, [storageKey, value]);

  return [value, setValue] as const;
}