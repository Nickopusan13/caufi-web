import { LuArrowUpDown } from "react-icons/lu";
import { Column } from "@tanstack/react-table";

export default function TableFilter<T>({
  column,
  title,
}: {
  column: Column<T, unknown>;
  title: string;
}) {
  return (
    <button
      className="flex items-center justify-center gap-1"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <LuArrowUpDown />
    </button>
  );
}
