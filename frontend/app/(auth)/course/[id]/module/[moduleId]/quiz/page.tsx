"use client"

import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import Link from "next/link";
import {QuizForm} from "@/components/form/quiz-form";
import {QuizRequest} from "@/schema/quiz-schema";
import {IconCheckupList} from "@tabler/icons-react";
import {useRef, useState} from "react";
import {toast} from "sonner";
import ModuleService from "@/service/module-service";
import QuizService from "@/service/quiz-service";

export default function QuizCreatePage() {
    const router = useRouter();
    const {id: courseId, moduleId} = useParams();
    const formRef = useRef<HTMLFormElement>(null)
    const [submit, setSubmit] = useState<boolean>(false)

    const onSubmit = (value: QuizRequest) => {
        if (value.question.length == 0) {
            toast.error("Question is empty!");
            return;
        }
        setSubmit(true);
        
        if (courseId && moduleId) QuizService.create(courseId.toString(), moduleId.toString(), value)
            .then((result) => {
                setSubmit(false);
                router.push(`/course/${courseId}/module/${moduleId}/quiz/${result.id}/update?type=update`);
            })
    }

    return (<div className="mt-3 mx-5">
        <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-6">
                <h1 className="text-2xl font-bold">
                    Create Quiz
                </h1>

                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/course/${courseId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>

                    <Button
                        variant="default"
                        type="button"
                        disabled={submit}
                        onClick={() => formRef.current?.requestSubmit()}
                    >
                        <IconCheckupList />
                        Submit
                    </Button>
                </div>
            </div>
        </header>
        {(courseId && moduleId) && (
            <QuizForm ref={formRef} onSubmit={onSubmit} />)}
    </div>)
}