"use client"

import {ColumnDef} from "@tanstack/react-table";
import {EnrollmentResponse} from "@/schema/enrollment-schema";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import SelectionAlert, {SelectionAlertResult} from "@/components/selection-alert";
import {EnrollmentService} from "@/service/enrollment-service";
import {useParams} from "next/navigation";

export const EnrollmentColumn: ColumnDef<EnrollmentResponse>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
        enableColumnFilter: false,
        enableSorting: false,
    },
    {
        id: "actions",
        enableHiding: false,
        maxSize: 100,
        size: 100,
        minSize: 100,
        cell: ({row}) => {
            const {id} = useParams();
            const [openDelete, setOpenDelete] = useState<boolean>(false)

            if (openDelete) return <SelectionAlert
                open={openDelete}
                title={`Delete ${row.original.email}`}
                onResult={(open) => {
                    if (open == SelectionAlertResult.accepted && id) {
                        EnrollmentService.delete(id.toString(), row.original.id)
                            .then(() => window.location.reload())
                    }
                    
                    setOpenDelete((prev) => !prev)
                }}
            />

            return (<Button type="button" variant="outline" onClick={() => setOpenDelete(true)}><Trash/> Delete</Button>)
        },
    }
]