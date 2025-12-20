"use client"

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import QuizService from "@/service/quiz-service";
import {QuizUserResponse} from "@/schema/quiz-schema";
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CalendarX, Clock} from "lucide-react";
import {setInterval} from "node:timers";
import {format} from "date-fns";
import {id} from "date-fns/locale"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {QuizViewForm} from "@/components/form/quiz-view-form";

export default function QuizViewPage() {
    const {id: courseId, moduleId, quizId} = useParams();

    const [quiz, setQuiz] = useState<QuizUserResponse | null>(null)
    const [start, setStart] = useState<boolean>(false)
    const [remainingTime, setRemainingTime] = useState<{ hour: number, minute: number, second: number } | null>()

    useEffect(() => {
        if (courseId && moduleId && quizId) QuizService.getByUser(courseId.toString(), moduleId.toString(), quizId.toString())
            .then((value) => {
                let a = value.question
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.random() * (i + 1) | 0;
                    [a[i], a[j]] = [a[j], a[i]];
                }

                setQuiz({...value, question: a});
            })
    }, [courseId, moduleId, quizId]);

    useEffect(() => {
        if (quiz) {
            const interval = setInterval(() => {
                const now = new Date().getTime();
                const end = new Date(quiz.endTime).getTime();
                const diff = end - now;

                if (diff <= 0) {
                    setRemainingTime(null)
                    return false
                }

                const totalSeconds = Math.floor(diff / 1000)

                setRemainingTime({
                    hour: Math.floor(totalSeconds / 3600),
                    minute: Math.floor((totalSeconds % 3600) / 60),
                    second: totalSeconds % 60
                })

                return true
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [quiz]);

    if (!quiz) return <div className="h-dvh flex justify-center items-center">
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[500px] w-[500px] cursor-progress rounded-xl"/>
            <div className="space-y-2">
                <Skeleton className="h-[50px] cursor-progress w-[500px]"/>
                <Skeleton className="h-[50px] cursor-progress w-[500px]"/>
            </div>
        </div>
    </div>;

    if (!start) return (<div className="h-dvh flex items-center justify-center">
        <Card className="w-full max-w-sm shadow-md">
            {/* Header */}
            <CardHeader className="text-center space-y-1">
                <CardTitle className="text-2xl font-semibold">
                    {quiz.title}
                </CardTitle>
            </CardHeader>

            {/* Content */}
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4"/>
                        <span className="text-sm">Remaining time</span>
                    </div>
                    {remainingTime == null ? (
                        <span className="font-semibold text-destructive">Time has run out</span>) : (<span
                        className="font-medium text-primary"> {remainingTime.hour}:{remainingTime.minute}:{remainingTime.second.toString().padStart(2, "0")}</span>)}
                </div>

                {/* Ditutup Kapan */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarX className="h-4 w-4"/>
                        <span className="text-sm">Closed</span>
                    </div>
                    <span
                        className="font-medium">{format(new Date(quiz.endTime), "dd MMM yyyy, HH:mm", {locale: id})}</span>
                </div>

                <div className="flex flex-col gap-3 rounded-lg p-3">
                    <Button
                        variant={quiz.accepted ? "destructive" : "default"}
                        onClick={() => setStart(true)}
                        disabled={quiz.accepted}>
                        {quiz.accepted ? "Not Allow" : "Start"}
                    </Button>

                    <Button variant="outline" asChild>
                        <Link href={`/course/${courseId}`}>Back</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>)

    return (<QuizViewForm data={quiz}/>)

}