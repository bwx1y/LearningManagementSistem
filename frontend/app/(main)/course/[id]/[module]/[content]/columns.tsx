import {ColumnDef} from "@tanstack/react-table";
import {ContentAnswerResponse, ContentAnswerTeacherResponse} from "@/schema/content-schema";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export const ContentAnswerColumns: ColumnDef<ContentAnswerTeacherResponse>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        id: "actions",
        enableHiding: false,
        maxSize: 100,
        size: 100,
        minSize: 100,
        cell: ({row}) => {
            return <Button variant="outline" asChild>
                <Link target="_blank" href={row.original.fileUrl}>Go</Link>
            </Button>
        }
    }
]