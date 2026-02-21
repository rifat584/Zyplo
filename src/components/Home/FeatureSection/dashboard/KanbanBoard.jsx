import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard({
  columns,
  activeColumn,
  selectedTaskId,
  reducedMotion,
  onColumnSelect,
  onTaskSelect,
}) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          active={activeColumn === column.id}
          selectedTaskId={selectedTaskId}
          reducedMotion={reducedMotion}
          onColumnSelect={onColumnSelect}
          onTaskSelect={onTaskSelect}
        />
      ))}
    </div>
  );
}
