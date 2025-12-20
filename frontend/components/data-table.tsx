"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {ArrowUpDown, ChevronDown, PlusIcon} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {MouseEventHandler, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";

interface DatatableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    addButton?:  MouseEventHandler<HTMLButtonElement>
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             addButton,
                                         }: DatatableProps<TData, TValue>) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const initialFilters: ColumnFiltersState = React.useMemo(() => {
        const entries: ColumnFiltersState = []
        for (const [key, value] of searchParams.entries()) {
            entries.push({ id: key, value })
        }
        return entries
    }, [searchParams])

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialFilters)
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

    const table = useReactTable({
        data,
        columns,
        state: {sorting, columnFilters, columnVisibility},
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })
    useEffect(() => {
        const params = new URLSearchParams()
        columnFilters.forEach((f) => {
            if (f.value) params.set(f.id, String(f.value))
        })
        const queryString = params.toString()
        router.replace(`?${queryString}`, { scroll: false })
    }, [columnFilters, router])

    return (
        <div className="w-full">
            {/* Search input */}
            <div className="flex items-center py-4 gap-4">
                {table.getAllColumns().map((column) => {
                    if (!column.getCanFilter()) return null
                    return (
                        <Input
                            key={column.id}
                            placeholder={`Search ${column.id}`}
                            value={(column.getFilterValue() as string) ?? ""}
                            onChange={(e) => column.setFilterValue(e.target.value)}
                            className="max-w-sm"
                        />
                    )
                })}

                {/* Column toggle menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown size={16}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(value)}
                                    className="capitalize"
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {addButton && (<div>
                    <Button onClick={addButton}>Add <PlusIcon/></Button>
                </div>)}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    header.column.toggleSorting(
                                                        header.column.getIsSorted() === "asc"
                                                    )
                                                }
                                                className="flex items-center gap-1"
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanSort() && <ArrowUpDown size={16}/>}
                                            </Button>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
