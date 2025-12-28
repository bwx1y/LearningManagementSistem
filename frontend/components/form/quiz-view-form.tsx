import {QuizAnswerRequest, QuizUserResponse} from "@/schema/quiz-schema";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Check, ChevronLeft, ChevronRight} from "lucide-react";
import QuizService from "@/service/quiz-service";
import {useParams} from "next/navigation";
import SelectionAlert, {SelectionAlertResult} from "@/components/selection-alert";

interface QuizViewFormProps {
    data: QuizUserResponse
}

export const QuizViewForm = (props: QuizViewFormProps) => {
    const {quizId, moduleId, id: courseId} = useParams()
    
    const questions = props.data.question;

    const [pageIndex, setPageIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<QuizAnswerRequest[]>([]);
    const [alert, setAlert] = useState<boolean>(false)

    const currentQuestion = questions[pageIndex];
    const isLastPage = pageIndex === questions.length - 1;

    if (!currentQuestion) {
        throw new Error("Question not found");
    }
    
    const isChecked = (quizId: string, choiceId: string) => {
        return answers.some(
            (a) => a.questionId === quizId && a.choiceId === choiceId
        );
    };
    
    const nextPage = () => {
        if (pageIndex < questions.length - 1) {
            setPageIndex((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (pageIndex > 0) {
            setPageIndex((prev) => prev - 1);
        }
    };

    const onSubmit = () => {
        if (courseId && moduleId && quizId && answers) {
            QuizService.answer(courseId.toString(), moduleId.toString(), quizId.toString(), answers)
                .then(() => {
                    setAlert(false)
                    window.location.reload()
                })
        }
    };
    
    return (
        <div className="h-dvh flex items-center justify-center">
            <SelectionAlert open={alert} title={`are you sure you will get your answer (${answers.length}/${questions.length})?`} onResult={onSubmit}/>
            <div className="flex items-start gap-8">
                {/* Card Pertanyaan */}
                <Card className="w-[420px]">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            {currentQuestion.text}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {currentQuestion.choice.map((item) => (
                            <div
                                key={item.id}
                                className="flex mt-2 items-center justify-between cursor-pointer rounded-lg border p-3"
                                onClick={() => setAnswers((prev) => [
                                    ...prev.filter(a => a.questionId !== currentQuestion.id),
                                    { questionId: currentQuestion.id, choiceId: item.id },
                                ])}
                            >
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="radio"
                                        name={currentQuestion.id} // penting!
                                        checked={isChecked(currentQuestion.id, item.id)}
                                        onChange={() =>
                                            setAnswers((prev) => [
                                                ...prev.filter(a => a.questionId !== currentQuestion.id),
                                                { questionId: currentQuestion.id, choiceId: item.id },
                                            ])
                                        }
                                    />
                                </div>
                                <span className="font-medium">{item.text}</span>
                            </div>
                        ))}

                        {/* Navigation */}
                        <div className="w-full flex justify-between mt-5">
                            <Button
                                variant="outline"
                                onClick={prevPage}
                                disabled={pageIndex === 0}
                            >
                                <ChevronLeft />
                            </Button>

                            {isLastPage ? (
                                <Button variant="outline" onClick={() => setAlert(true)}>
                                    <Check />
                                </Button>
                            ) : (
                                <Button variant="outline" onClick={nextPage}>
                                    <ChevronRight />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Nomor Soal */}
                <Card>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-3">
                            {questions.map((item, i) => (
                                <Button
                                    key={item.id}
                                    variant={i === pageIndex ? "default" : "outline"}
                                    className="w-9 h-9 p-0 text-sm rounded-md"
                                    onClick={() => setPageIndex(i)}>
                                    {i + 1}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
