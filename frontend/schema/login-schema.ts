import {z} from "zod"
import {Role} from "@/schema/enum/role";
export const LoginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string("Password tidak valid")
})

export type LoginSchema = z.infer<typeof LoginSchema>

export type LoginResponse = {
    id: string
    email: string
    name: string
    role: Role,
    token: string
    refreshToken: string
}

export type MeResponse = {
    id: string
    email: string
    name: string
    role: Role  
}