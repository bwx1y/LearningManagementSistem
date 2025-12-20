"use client"
import {QuizRequest, QuizResponse} from "@/schema/quiz-schema";
import {Control, Controller, FieldErrors, useFieldArray, useForm, UseFormRegister, UseFormWatch} from "react-hook-form";
import {FieldDateTime, FieldInput} from "@/components/ui/field-input";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {PlusIcon, TrashIcon} from "lucide-react";
import React, {forwardRef} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Input} from "@/components/ui/input";

interface QuizFormProps {
    onSubmit: (value: QuizRequest) => void,
    data?: QuizResponse | undefined,
}

interface QuizAnswerFormProps {
    position: number,
    control: Control<QuizRequest, unknown, QuizRequest>,
    register: UseFormRegister<QuizRequest>,
    watch: UseFormWatch<QuizRequest>,
    errors: FieldErrors<QuizResponse>,
}

const QuizAnswerLetter = ["A", "B", "C", "D"];

const QuizAnswerForm = (props: QuizAnswerFormProps) => {
    const {fields, append, remove} = useFieldArray({
        control: props.control,
        name: `question.${props.position}.choice`,
    })

    return (<Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Answer (text)</TableHead>
                <TableHead className="w-[50px] text-center" align="center">Correct</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <Controller
                control={props.control}
                name={`question.${props.position}.correctIndex`}
                render={({field: correctField}) => (<>
                    {fields.map((field, index) => (<TableRow key={field.id}>
                        <TableCell className="w-[50px]">{QuizAnswerLetter[index]}</TableCell>
                        <TableCell>
                            <Input {...props.register(`question.${props.position}.choice.${index}.text`)} />
                            {props.errors?.question?.[props.position]?.choice?.[index]?.text && (
                                <p className="text-red-500 text-sm mt-1">{props.errors?.question?.[props.position]?.choice?.[index]?.text?.message}</p>)}
                        </TableCell>
                        <TableCell className="w-[50px]">
                            <Input
                                type="checkbox"
                                checked={props.watch(`question.${props.position}.correctIndex`) == index}
                                onChange={() => {
                                    correctField.onChange(index)
                                }}
                            />
                        </TableCell>
                        <TableCell className="w-[50px]">
                            <Button type="button"
                                    variant="outline"
                                    disabled={(fields.length - 1) == 0}
                                    onClick={() => {
                                        if ((fields.length - 1) != 0) remove(index)
                                        if (correctField.value == index || correctField.value > (fields.length - 2)) correctField.onChange((fields.length - 2))
                                    }}><TrashIcon/></Button>
                        </TableCell>
                    </TableRow>))}
                </>)}/>
            {fields.length < QuizAnswerLetter.length && (<TableRow>
                <TableCell colSpan={3} className="text-right">
                    <Button type="button" variant="outline"
                            onClick={() => append({id: null, text: "", isCorrect: false})}>
                        <PlusIcon className="mr-2 h-4 w-4"/>
                        Add Answer {QuizAnswerLetter[fields.length]}
                    </Button>
                </TableCell>
            </TableRow>)}
        </TableBody>
    </Table>)
}

export const QuizForm = forwardRef<HTMLFormElement, QuizFormProps>((props, ref) => {
    const {register, control, formState: {errors}, handleSubmit, watch} = useForm<QuizRequest>({
        resolver: zodResolver(QuizRequest),
        defaultValues: {
            ...props.data,
            question: props.data?.question.map((q) => ({
                ...q,
                correctIndex: q.choice.findLastIndex((c) => c.isCorrect)
            }))
        }
    })

    const {fields: questionField, append: addQuestion, remove: removeQuestion} = useFieldArray({
        control,
        name: "question"
    })

    const onSubmit = (value: QuizRequest) => {
        const result: QuizRequest = {
            ...value,
            question: value.question.map((question) => ({
                ...question,
                choice: question.choice.map((choice, index) => ({
                    ...choice,
                    isCorrect: question.correctIndex === index
                }))
            }))
        }

        props.onSubmit(result)
    }

    return (<form ref={ref} onSubmit={handleSubmit(onSubmit)}>
        <Card className="mt-5">
            <CardContent>
                <FieldInput title={"Title"} {...register("title")} error={errors.title}/>
                <Controller
                    name={"startTime"}
                    control={control}
                    render={({field}) => (<FieldDateTime
                        className="mt-6"
                        dateTitle={"Start Date"}
                        timeTitle={"Start Time"}
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={value => field.onChange(value.toISOString())}
                        error={errors.startTime?.message}
                    />)}
                />
                <Controller
                    name={"endTime"}
                    control={control}
                    render={({field}) => (<FieldDateTime
                        className="mt-6"
                        dateTitle={"End Date"}
                        timeTitle={"End Time"}
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={value => field.onChange(value.toISOString())}
                        error={errors.endTime?.message}
                    />)}
                />
            </CardContent>
        </Card>
        {questionField.map((question, index) => (<Card className="mt-5" key={question.id}>
            <CardContent>
                <div className="flex items-end gap-2">
                    <FieldInput
                        title={`Question - #${index + 1}`}
                        {...register(`question.${index}.text`)}
                    />

                    <Button variant="outline" type="button"
                            onClick={() => removeQuestion(index)}><TrashIcon/> Remove</Button>
                </div>

                <QuizAnswerForm watch={watch} control={control} register={register} position={index} errors={errors}/>

                {errors.question?.[index]?.text && (
                    <p className="text-red-500 text-sm mt-1">{errors.question?.[index]?.text.message}</p>
                )}
            </CardContent>
        </Card>))}
        <Card className="mt-5">
            <CardContent className="flex justify-end">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => addQuestion({
                        id: null,
                        text: "",
                        correctIndex: 0,
                        choice: [{id: null, text: "", isCorrect: false}]
                    })}
                ><PlusIcon/> Add Question</Button>
            </CardContent>
        </Card>
    </form>)
})