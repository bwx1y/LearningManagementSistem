import z from 'zod'

export type EnrollmentResponse = {
    id: string;
    name: string;
    email: string;
}

export const EnrollmentRequest = z.object({
    userId: z.string({message: "user is required"}).nonempty({message: "user is required"}),
})

export type EnrollmentRequest = z.infer<typeof EnrollmentRequest>