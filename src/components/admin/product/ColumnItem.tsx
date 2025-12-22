import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { GoKebabHorizontal } from "react-icons/go";
import type { ProductOut } from "@/api/product";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TableFilter from "@/components/ui/TableFilter";

const getUniqueColors = (variants: ProductOut["variants"] = []) => {
  const colorMap = new Map<string, string>();
  variants.forEach((v) => {
    if (v.color && v.hex) {
      colorMap.set(v.color, v.hex);
    }
  });
  return Array.from(colorMap, ([color, hex]) => ({ color, hex }));
};

const getUniqueSizes = (variants: ProductOut["variants"] = []) => [
  ...new Set(variants.map((v) => v.size).filter(Boolean)),
];

const getTotalStock = (variants: ProductOut["variants"] = []) =>
  variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);

export const getColumns = (
  handleDelete: (id: number) => void,
  handleEdit: (product: ProductOut) => void
): ColumnDef<ProductOut>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="border-blue-900"
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomeRowsSelected() && "indeterminate")
        }
        onCheckedChange={(val) => table.toggleAllRowsSelected(!!val)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="border-blue-900"
        checked={row.getIsSelected()}
        onCheckedChange={(val) => row.toggleSelected(!!val)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const images = row.original.images ?? [];
      const firstImage = images[0]?.imageUrl;
      return firstImage ? (
        <div className="relative w-16 h-16">
          <Image
            src={firstImage}
            alt={row.original.name}
            fill
            className="object-cover rounded"
            sizes="64px"
          />
        </div>
      ) : (
        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
          No image
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const { name, slug } = row.original;
      return (
        <Link href={`/products/${slug}`} className="hover:underline">
          {name}
        </Link>
      );
    },
  },
  {
    id: "stock",
    header: ({ column }) => <TableFilter column={column} title="Stock" />,
    accessorFn: (row) => getTotalStock(row.variants),
    cell: ({ row }) => {
      const total = getTotalStock(row.original.variants);
      return <span>{total}</span>;
    },
  },
  {
    id: "regularPrice",
    header: ({ column }) => (
      <TableFilter column={column} title="Regular Price" />
    ),
    accessorFn: (row) => {
      const variants = row.variants ?? [];
      if (!variants.length) return null;
      const prices = variants.map((v) => Number(v.regularPrice));
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return min === max ? min : [min, max];
    },
    cell: ({ row }) => {
      const value = row.getValue("regularPrice") as
        | number
        | [number, number]
        | null;
      if (value === null) return <span>-</span>;
      if (Array.isArray(value)) {
        return (
          <span>
            ${value[0].toFixed(2)} – ${value[1].toFixed(2)}
          </span>
        );
      }
      return <span>${(value as number).toFixed(2)}</span>;
    },
  },
  {
    id: "discountPrice",
    header: ({ column }) => (
      <TableFilter column={column} title="Discount Price" />
    ),
    accessorFn: (row) => {
      const variants = row.variants ?? [];
      const discounts = variants
        .map((v) => (v.discountPrice ? Number(v.discountPrice) : null))
        .filter((p): p is number => p !== null);
      if (!discounts.length) return null;
      const min = Math.min(...discounts);
      const max = Math.max(...discounts);
      return min === max ? min : [min, max];
    },
    cell: ({ row }) => {
      const value = row.getValue("discountPrice") as
        | number
        | [number, number]
        | null;
      if (value === null) return <span className="text-gray-400">-</span>;

      if (Array.isArray(value)) {
        return (
          <span>
            ${value[0].toFixed(2)} – ${value[1].toFixed(2)}
          </span>
        );
      }
      return <span>${(value as number).toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => <TableFilter column={column} title="Category" />,
    cell: ({ row }) => <span>{row.original.category || "-"}</span>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "shippingType",
    header: ({ column }) => (
      <TableFilter column={column} title="Shipping Type" />
    ),
    cell: ({ row }) => <span>{row.original.shippingType || "-"}</span>,
  },
  {
    id: "colors",
    header: "Color",
    cell: ({ row }) => {
      const colors = getUniqueColors(row.original.variants);
      if (!colors.length) return <span>-</span>;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              {colors.slice(0, 3).map((c, idx) => (
                <span
                  key={idx}
                  className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                  title={c.color}
                />
              ))}
              {colors.length > 3 && (
                <span className="w-5 h-5 flex items-center justify-center text-xs rounded-full bg-gray-200 border border-gray-300 cursor-pointer">
                  +{colors.length - 3}
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="grid grid-cols-6 gap-2 p-1">
              {colors.map((c, idx) => (
                <span
                  key={idx}
                  className="w-6 h-6 rounded-full border border-black/20 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                  title={c.color}
                />
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "sizes",
    header: "Size",
    cell: ({ row }) => {
      const sizes = getUniqueSizes(row.original.variants);
      if (!sizes.length) return <span>-</span>;
      return <span className="text-sm">{sizes.join(", ")}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-950 rounded">
            <GoKebabHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleEdit(row.original)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-orange-600">
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
