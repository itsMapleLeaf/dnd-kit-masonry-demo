import { useEffect, useState } from "react"

export function useSize() {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [element, ref] = useState<Element | null>()

  useEffect(() => {
    if (!element) return

    const resizeObserver = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
      setHeight(entry.contentRect.height)
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [element])

  return [ref, { width, height }] as const
}
