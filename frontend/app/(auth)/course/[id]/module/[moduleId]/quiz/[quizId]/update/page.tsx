"use client"

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {IconCheckupList} from "@tabler/icons-react";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {QuizForm} from "@/components/form/quiz-form";
import {QuizRequest, QuizResponse} from "@/schema/quiz-schema";
import QuizService from "@/service/quiz-service";
import {toast} from "sonner";

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

    const [submit, setSubmit] = useState<boolean>(false);
    const [quiz, setQuiz] = useState<QuizResponse | null>(null);
    const [page, setPage] = useState<IQueryType>(IQueryType.update)

    useEffect(() => {
        const isValid = Object.values(IQueryType).includes(queryType as IQueryType);

        if (!isValid) {
            router.replace(`update?type=${IQueryType.update.toString()}`)
            return;
        }

        const type: IQueryType =
            Object.values(IQueryType).includes(queryType as IQueryType) ? (queryType as IQueryType): IQueryType.update;
        
        setPage(type)
    }, [queryType]);

    useEffect(() => {
        if (courseId && moduleId && quizId) QuizService.get(courseId.toString(), moduleId.toString(), quizId.toString())
            .then((res) => {
                setQuiz(res)
            })
    }, [courseId, moduleId, quizId])


    const onSubmit = (value: QuizRequest) => {
        if (courseId && moduleId && quizId) QuizService.update(courseId.toString(), moduleId.toString(), quizId.toString(), value)
            .then((result) => {
                toast.success("Successfully updated quiz!");
            })
    }

    return <div className="mt-3 mx-5">
        <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-6">
                <h1 className="text-2xl font-bold">
                    Update Quiz
                </h1>

                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/course/${courseId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4"/>
                            Back
                        </Link>
                    </Button>

                    <Button
                        variant="default"
                        type="button"
                        disabled={submit}
                        onClick={() => {
                            formRef.current?.requestSubmit();
                        }}
                    >
                        <IconCheckupList/>
                        Save
                    </Button>
                </div>
            </div>
        </header>
        {quiz && (<QuizForm ref={formRef} onSubmit={onSubmit} data={quiz}/>)}
    </div>
}