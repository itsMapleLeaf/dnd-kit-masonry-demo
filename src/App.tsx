import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arraySwap,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { motion } from "framer-motion"
import { useState } from "react"
import { Masonry } from "./Masonry"
import { range } from "./range"

const initialItems = range(15).map((id) => ({
  id: id + 1,
  height: 100 + Math.random() * 400,
}))

type Item = typeof initialItems[number]

export function App() {
  const [items, setItems] = useState(initialItems)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={(event) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
          setItems((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over.id)
            return arraySwap(items, oldIndex, newIndex)
          })
        }
      }}
    >
      <motion.div className="p-4 overflow-clip" layout>
        <SortableContext items={items} strategy={() => null}>
          <Masonry
            items={items}
            itemKey={(item) => item.id}
            columnWidth={300}
            gap={8}
            renderItem={(item) => (
              <SortableCell id={item.id}>
                <ItemBox item={item} />
              </SortableCell>
            )}
          />
        </SortableContext>
      </motion.div>
    </DndContext>
  )
}

function SortableCell({
  id,
  children,
}: {
  id: string | number
  children: React.ReactNode
}) {
  const sortable = useSortable({ id })

  return (
    <motion.div
      layoutId={String(id)}
      ref={sortable.setNodeRef}
      animate={
        sortable.transform
          ? {
              x: sortable.transform.x,
              y: sortable.transform.y,
              opacity: sortable.over ? 0.5 : 1,
            }
          : { x: 0, y: 0, opacity: sortable.isOver ? 0.75 : 1 }
      }
      transition={sortable.isDragging ? { duration: 0 } : undefined}
      {...sortable.attributes}
      {...sortable.listeners}
    >
      {children}
    </motion.div>
  )
}

function ItemBox({ item }: { item: Item }) {
  return (
    <div
      className="bg-blue-700 text-white font-bold text-center text-6xl"
      style={{
        height: item.height,
        lineHeight: item.height + "px",
      }}
    >
      {item.id}
    </div>
  )
}
