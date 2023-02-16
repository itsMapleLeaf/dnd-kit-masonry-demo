import { Dispatch, Ref } from "react"
import { useEffectEvent } from "./useEffectEvent"

export function useMergedRefs<T>(...refs: Array<Ref<T> | Dispatch<T | null>>) {
  return useEffectEvent((node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current = node
      }
    }
  })
}
