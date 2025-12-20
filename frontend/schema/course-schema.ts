import {z} from 'zod'

export type CourseResponse = {
    id: string
    title: string
    description: string
    teacher: {
        id: string
        name: string
        email: string
    }
}

export const CourseRequest = z.object({
    title: z.string().nonempty({message: "course title is required"}),
    description: z.string().nonempty({message: "course description is required"}),
    teacherId: z.string().nonempty({message: "teacher is required"}),
})

export type CourseRequest = z.infer<typeof CourseRequest>