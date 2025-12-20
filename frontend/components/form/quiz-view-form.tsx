import {QuizUserResponse} from "@/schema/quiz-schema";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Check, ChevronLeft, ChevronRight} from "lucide-react";

interface QuizViewFormProps {
    data: QuizUserResponse
}

export const QuizViewForm = (props: QuizViewFormProps) => {
    const [page, setPage] = useState<string>(props.data.question[0].id);
    const [answer, setAnswer] = useState<{ quizId: string, choice: string }[]>([]);

    const findQuestion = () => {
        const entity = props.data.question.find((question) => question.id === page)
        if (entity == undefined) throw new Error("Question not found.");

        return entity;
    };
    
    const nextPage = () => {
        
    }
    
    const prevPage = () => {
        
    }
    
    const onSubmit = () =>{
        
    }

    return <div className="h-dvh flex items-center justify-center">
        <div className="flex items-start gap-8">

            {/* Card Pertanyaan */}
            <Card className="w-[420px]">
                <CardHeader>
                    <CardTitle className="text-xl">{findQuestion().text}</CardTitle>
                </CardHeader>
                <CardContent>
                    {findQuestion().choice.map((item) => (<div
                        key={item.id}
                        className="flex mt-2 items-center justify-between rounded-lg border cursor-pointer p-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Input type={"checkbox"}/>
                        </div>
                        <span className="font-medium">{item.text}</span>
                    </div>))}
                    
                    
                    <div className="w-full flex justify-between mt-5">
                        <Button variant="outline" onClick={prevPage}><ChevronLeft/></Button>
                        {(props.data.question[props.data.question.length - 1].id == findQuestion().id) ?
                            (<Button variant="outline" onClick={nextPage}><Check/></Button>) :
                            (<Button variant="outline" onClick={onSubmit}><ChevronRight/></Button>)}
                    </div>
                </CardContent>
            </Card>

            {/* Nomor Soal */}
            <Card>
                <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                        {props.data.question.map((item, i) => (
                            <Button
                                key={item.id}
                                variant={item.id == page ? "default" : "outline"}
                                className="w-9 h-9 p-0 text-sm rounded-md"
                                onClick={() => setPage(item.id)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
}