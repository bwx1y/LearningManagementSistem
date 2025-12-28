import { z } from "zod"

export type QuizResponse = {
    id: string
    title: string
    startTime: string
    endTime: string
    question: {
        id: string
        text: string
        choice: {
            id: string
            text: string
            isCorrect: boolean
        }[]
    }[]
}

export type QuizUserResponse = {
    id: string
    title: string
    startTime: string
    endTime: string
    accepted: boolean,
    question: {
        id: string
        text: string
        choice: {
            id: string
            text: string
        }[]
    }[]
}

const ChoiceSchema = z.object({
    id: z.string().nullable(),
    text: z
        .string()
        .min(1, "Choice text is required"),
    isCorrect: z.boolean(),
})

const QuestionSchema = z.object({
    id: z.string().nullable(),
    text: z
        .string()
        .min(1, "Question text is required"),
    correctIndex: z.number(),
    choice: z
        .array(ChoiceSchema)
})

export const QuizRequest = z.object({
    title: z
        .string()
        .min(1, "Title is required"),

    startTime: z
        .string()
        .datetime({ message: "Start time must be a valid ISO datetime" }),

    endTime: z
        .string()
        .datetime({ message: "End time must be a valid ISO datetime" }),

    question: z
        .array(QuestionSchema)
}).refine(
    (data) => new Date(data.endTime) > new Date(data.startTime),
    {
        message: "End time must be later than start time",
        path: ["endTime"],
    }
)

export type QuizRequest = z.infer<typeof QuizRequest>

export type QuizAnswerRequest = {
    questionId: string,
    choiceId: string
}

export type QuizAnswerResponse = {
    name: string,
    email: string,
    score: number
}