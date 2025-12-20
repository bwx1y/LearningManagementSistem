import {ContentResponse} from "@/schema/content-schema";
import {z} from "zod"

export type ModuleResponse = {
    id: string
    title: string
    order: number
    cratedAt: Date
    content: ContentResponse[]
}

export const ModuleRequest= z.object({
    title: z.string().nonempty({message: "module title is required"}),
})

export type ModuleRequest = z.infer<typeof ModuleRequest>