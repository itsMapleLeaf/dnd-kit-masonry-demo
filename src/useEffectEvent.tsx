import { useCallback, useInsertionEffect, useRef } from "react"

export function useEffectEvent<Args extends unknown[], Return>(
  callback: (...args: Args) => Return,
) {
  const callbackRef = useRef<typeof callback>(() => {
    throw new Error("Cannot call an event handler while rendering.")
  })

  useInsertionEffect(() => {
    callbackRef.current = callback
  })

  return useCallback((...args: Args) => callbackRef.current(...args), [])
}
