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
  rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
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
      <div className="p-4 overflow-clip">
        <SortableContext items={items} strategy={rectSwappingStrategy}>
          <Masonry
            items={items}
            itemKey={(item) => item.id}
            columnWidth={300}
            gap={8}
            renderItem={(item) => <Cell item={item} />}
          />
        </SortableContext>
      </div>
    </DndContext>
  )
}

function Cell({ item }: { item: Item }) {
  const sortable = useSortable({
    id: item.id,
    animateLayoutChanges: (args) => {
      // return false
      // return args.isSorting
      return !args.wasDragging
    },
  })

  const getPlaceholderHeight = () => {
    if (sortable.isOver && sortable.active) {
      return sortable.active.rect.current.initial?.height
    }

    if (sortable.isDragging && sortable.over) {
      return sortable.over.rect.height
    }

    return item.height
  }

  return (
    <div style={{ height: getPlaceholderHeight(), transition: "0.2s height" }}>
      <div
        ref={sortable.setNodeRef}
        style={{
          height: item.height,
          lineHeight: item.height + "px",
          transform: CSS.Translate.toString(sortable.transform),
          transition: sortable.transition,
          // opacity:
          //   sortable.isOver && sortable.over?.id !== sortable.active?.id
          //     ? 0.5
          //     : 1,
        }}
        {...sortable.attributes}
        {...sortable.listeners}
        className="bg-blue-700 text-white font-bold text-center text-6xl"
      >
        {item.id}
      </div>
    </div>
  )
}
