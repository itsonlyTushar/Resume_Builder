import { useDispatch, useSelector } from "react-redux";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateSectionOrder } from "../../features/templateSlice";

const SECTION_LABELS = {
  description: "Summary",
  education: "Education",
  projects: "Projects",
  experience: "Experience",
  skills: "Technical Skills",
};

function SortableSection({ id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white select-none ${
        isDragging
          ? "shadow-lg border-black"
          : "border-gray-200 hover:border-gray-400"
      }`}
    >
      {/* Drag handle */}
      <span
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing touch-none"
        title="Drag to reorder"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="9" cy="5" r="1.5" />
          <circle cx="15" cy="5" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="15" cy="19" r="1.5" />
        </svg>
      </span>
      <span className="text-sm font-medium text-gray-800">
        {SECTION_LABELS[id] ?? id}
      </span>
    </div>
  );
}

export default function SectionOrderPanel() {
  const dispatch = useDispatch();
  const sectionOrder = useSelector(
    (state) => state.resumeBuilder.form_data.sectionOrder
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = sectionOrder.indexOf(active.id);
    const newIndex = sectionOrder.indexOf(over.id);
    dispatch(updateSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex)));
  };

  return (
    <div className="border rounded-3xl p-6 bg-white shadow-sm w-full">
      <h2 className="text-base font-semibold mb-1 text-gray-900">
        Section Order
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Drag to rearrange the sections in your resume
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {sectionOrder.map((id) => (
              <SortableSection key={id} id={id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
