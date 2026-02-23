import { BentoCard } from "../BentoCard";

export function KanbanCard({ columns }) {
  return (
    <BentoCard
      title="Kanban Board"
      right={<span className="text-[11px] text-zinc-500 dark:text-gray-400">Current sprint</span>}
      className="col-span-1 md:col-span-6 lg:col-span-6"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column.title}
            className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-zinc-50/70 p-2.5 dark:border-gray-700 dark:bg-[#111A2E]/70"
          >
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-gray-400">
              {column.title}
            </p>
            {column.tasks.map((task) => (
              <div
                key={task.title}
                className="flex min-h-18.5 flex-col justify-between rounded-lg border border-zinc-200 bg-white p-2.5 text-[11px] dark:border-gray-700 dark:bg-[#0F1629]"
              >
                <p className="line-clamp-2 font-medium leading-snug text-zinc-800 dark:text-gray-200">
                  {task.title}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {task.priority ? (
                      <span className="rounded-full border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-700">
                        {task.priority}
                      </span>
                    ) : null}
                    {task.due ? (
                      <span className="rounded-full border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:border-gray-700 dark:text-gray-400">
                        {task.due}
                      </span>
                    ) : null}
                  </div>
                  {task.assignee ? (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-[9px] font-semibold text-zinc-700 dark:border-gray-700 dark:bg-[#111A2E] dark:text-gray-300">
                      {task.assignee}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </BentoCard>
  );
}
