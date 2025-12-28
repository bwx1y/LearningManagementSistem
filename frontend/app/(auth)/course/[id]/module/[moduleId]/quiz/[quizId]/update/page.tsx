"use client"

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowLeft, CheckCheck, Pencil} from "lucide-react";
import {IconCheckupList} from "@tabler/icons-react";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {QuizForm} from "@/components/form/quiz-form";
import {QuizAnswerResponse, QuizRequest, QuizResponse} from "@/schema/quiz-schema";
import QuizService from "@/service/quiz-service";
import {toast} from "sonner";
import {Card, CardContent} from "@/components/ui/card";
import {DataTable} from "@/components/data-table";
import {QuizAnswerColumns} from "@/app/(auth)/course/[id]/module/[moduleId]/quiz/[quizId]/update/colums";

enum IQueryType {
    update = "update",
    show = "show",
}

export default function QuizUpdatePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryType = searchParams.get("type");

    const {id: courseId, moduleId, quizId} = useParams();

    const formRef = useRef<HTMLFormElement>(null);

    const [quiz, setQuiz] = useState<QuizResponse | null>(null);
    const [page, setPage] = useState<IQueryType>(IQueryType.update);
    const [quizResponse, setQuizResponse] = useState<QuizAnswerResponse[]>([]);

    useEffect(() => {
        const isValid = Object.values(IQueryType).includes(queryType as IQueryType);
        if (!isValid) {
            router.replace(`update?type=${IQueryType.update.toString()}`)
            return;
        }

        const type: IQueryType =
            Object.values(IQueryType).includes(queryType as IQueryType) ? (queryType as IQueryType) : IQueryType.update;

        setPage(type)
    }, [queryType]);

    useEffect(() => {
        if (courseId && moduleId && quizId) {
            QuizService.get(courseId.toString(), moduleId.toString(), quizId.toString())
                .then((res) => {
                    setQuiz(res)
                })
            QuizService.getAnswer(courseId.toString(), moduleId.toString(), quizId.toString())
                .then(setQuizResponse)
        }
    }, [courseId, moduleId, quizId])


    const onSubmit = (value: QuizRequest) => {
        if (courseId && moduleId && quizId) QuizService.update(courseId.toString(), moduleId.toString(), quizId.toString(), value)
            .then(() => {
                toast.success("Successfully updated quiz!");
            })
    }

    return <div className="mt-3 mx-5">
        <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-6">
                <h1 className="text-2xl font-bold">
                    {page == IQueryType.show ? "Show Answer Quiz" : "Update Quiz"}
                </h1>

                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/course/${courseId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Back
                        </Link>
                    </Button>

                    {page == IQueryType.update && (<>
                            <Button
                                variant="default"
                                type="button"
                                onClick={() => {
                                    formRef.current?.requestSubmit();
                                }}
                            >
                                <IconCheckupList/>
                                Save
                            </Button>

                            <Button variant="outline"
                                    onClick={() => router.replace(`update?type=${IQueryType.show.toString()}`)}>
                                <CheckCheck className="mr-2 h-4 w-4"/>
                                Answer
                            </Button>
                        </>
                    )}
                    {page == IQueryType.show && (
                        <Button variant="outline"
                                onClick={() => router.replace(`update?type=${IQueryType.update.toString()}`)}>
                            <Pencil className="mr-2 h-4 w-4"/>
                            Update
                        </Button>
                    )}
                </div>
            </div>
        </header>
        {(quiz && page == IQueryType.update) && (<QuizForm ref={formRef} onSubmit={onSubmit} data={quiz}/>)}
        {page == IQueryType.show && (<>
            <Card className="mt-4">
                <CardContent>
                    <DataTable
                        columns={QuizAnswerColumns}
                        data={quizResponse}
                        getRowId={(value) => value.email}/>
                </CardContent>
            </Card>
        </>)}
    </div>
}