"use client"

import {ColumnDef} from "@tanstack/react-table";
import {CourseResponse} from "@/schema/course-schema";
import {Button} from "@/components/ui/button";
import {Edit, MoreHorizontal, Trash, User2, Users} from "lucide-react";
import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import CourseForm from "@/components/form/course-form";
import SelectionAlert, {SelectionAlertResult} from "@/components/selection-alert";
import CourseService from "@/service/course-service";
import {useRouter} from "next/navigation";

enum MenuState {
    None,
    Update,
    Delete
}

export const CourseColumns: ColumnDef<CourseResponse>[] = [
    {
        accessorKey: "title",
        header: "Title"
    },
    {
        accessorKey: "description",
        header: "Description",
        enableColumnFilter: false,
        enableSorting: false,
    },
    {
        accessorKey: "teacher",
        header: "Teacher",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({row}) => row.original.teacher.name
    },
    {
        id: "actions",
        enableHiding: false,
        maxSize: 100,
        size: 100,
        minSize: 100,
        cell: ({row}) => {
            const route = useRouter();
            const [open, setOpen] = React.useState<MenuState>(MenuState.None);

            if (open == MenuState.Update) return <CourseForm data={row.original} open={open == MenuState.Update}
                                                             onOpenChange={() => setOpen(MenuState.None)}/>

            if (open == MenuState.Delete) return <SelectionAlert
                open={open == MenuState.Delete} 
                title={"Delete Course"}
                description={`are you sure delete ${row.original.title}`}
                onResult={async (value) => {
                    setOpen(MenuState.None);
                    
                    if (value == SelectionAlertResult.accepted) {
                        await CourseService.delete(row.original.id)
                    }
                }}/>

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                            route.push(`/course/${row.original.id}/user`)
                        }}><Users/> User</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpen(MenuState.Update)}><Edit/> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpen(MenuState.Delete)}><Trash/> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]