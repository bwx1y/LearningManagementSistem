import {ColumnDef} from "@tanstack/react-table";
import {EnrollmentResponse} from "@/schema/enrollment-schema";
import {QuizAnswerResponse} from "@/schema/quiz-schema";

export const QuizAnswerColumns: ColumnDef<QuizAnswerResponse>[] = [
    {
        accessorKey: "name",
        header: "Name",
        id: "name",
    },
    {
        accessorKey: "email",
        header: "Email",
        id: "email",
    },
    {
        accessorKey: "score",
        header: "Score",
        enableColumnFilter: false,
        id: "score",
    }
]