import {ColumnDef} from "@tanstack/react-table";
import {UserResponse} from "@/schema/user-schema";
import {Role} from "@/schema/enum/role";
import React from "react";
import CourseForm from "@/components/form/course-form";
import SelectionAlert, {SelectionAlertResult} from "@/components/selection-alert";
import CourseService from "@/service/course-service";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Edit, MoreHorizontal, Trash} from "lucide-react";
import UserForm from "@/components/form/user-form";
import UserService from "@/service/user-service";

enum MenuState {
    None = 0,
    Update = 1,
    Delete = 2
}

export const UserColumns: ColumnDef<UserResponse>[] = [
    {
        accessorKey: "name",
        header: "Name"
    },
    {
        accessorKey: "email",
        header: "Email",
        enableSorting: false,
    },
    {
        accessorKey: "role",
        header: "Role",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => Role[row.original.role]
    },
    {
        id: "actions",
        enableHiding: false,
        maxSize: 100,
        size: 100,
        minSize: 100,
        cell: ({row}) => {
            const [open, setOpen] = React.useState<MenuState>(MenuState.None);

            if (open == MenuState.Update) return <UserForm data={row.original} open={open == MenuState.Update}
                                                             onOpenChange={() => setOpen(MenuState.None)}/>

            if (open == MenuState.Delete) return <SelectionAlert
                open={open == MenuState.Delete}
                title={"Delete Course"}
                description={`are you sure delete ${row.original.name}`}
                onResult={async (value) => {
                    setOpen(MenuState.None);

                    if (value == SelectionAlertResult.accepted) {
                        await UserService.delete(row.original.id)
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
                        <DropdownMenuItem onClick={() => setOpen(MenuState.Update)}><Edit/> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpen(MenuState.Delete)}><Trash/> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]