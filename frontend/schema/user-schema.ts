import {Role} from "@/schema/enum/role";
import {z} from "zod";

export type UserResponse = {
    id: string,
    name: string,
    email: string,
    role: Role
}

export const UserRequest = z.object({
    name: z.string().nonempty({ message: "user name is required" }),
    email: z
        .string()
        .nonempty({ message: "user email is required" })
        .email({ message: "user email is type email" }),
    role: z.nativeEnum(Role, {message: "user role is required" }),
    password: z.string().optional(),
    confirmPassword: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "password and confirm password do not match",
    path: ["confirmPassword"],
});

export type UserRequest = z.infer<typeof UserRequest>

