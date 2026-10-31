"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AsyncState<T> =
  | { status: "loading"; data: undefined; error: undefined }
  | { status: "success"; data: T; error: undefined }
  | { status: "error"; data: undefined; error: Error };

/**
 * Runs an async loader on mount and whenever `key` changes.
 * Keeps the previous data while reloading (no flash of skeleton).
 */
export function useAsync<T>(loader: () => Promise<T>, key = "") {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading", data: undefined, error: undefined });
  const [nonce, setNonce] = useState(0);
  const loaderRef = useRef(loader);

  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    let active = true;
    loaderRef.current().then(
      (data) => {
        if (active) setState({ status: "success", data, error: undefined });
      },
      (error: unknown) => {
        if (active) {
          setState({
            status: "error",
            data: undefined,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      },
    );
    return () => {
      active = false;
    };
  }, [key, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const setData = useCallback((data: T) => setState({ status: "success", data, error: undefined }), []);

  return { ...state, reload, setData };
}
