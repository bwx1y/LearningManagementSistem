import z from "zod"
import {ContentType} from "@/schema/enum/content-type";

export type ContentResponse = {
    id: string
    type: number
    order: number
    textContent: string | null
    linkUrl: null | string
    quizId: null | string
}

export const ContentTextRequest = z.object({
    type: z.nativeEnum(ContentType),
    textContent: z.string().nonempty({ message: "Not null" }),
})

export type ContentTextRequest = z.infer<typeof ContentTextRequest>

export const ContentLinkRequest = z.object({
    type: z.nativeEnum(ContentType),
    textContent: z.string().nonempty({ message: "Not null" }),
    linkUrl: z.string({message: "type string"}).url({message: "type url"}).nonempty({ message: "Not null" })
})

export type ContentLinkRequest = z.infer<typeof ContentLinkRequest>

export const ContentFileRequest = z.object({
    type: z.nativeEnum(ContentType),
    textContent: z.string().nonempty({ message: "Not null" }),
})

export type ContentFileRequest = z.infer<typeof ContentFileRequest>

export type ContentRequest = ContentTextRequest | ContentLinkRequest | ContentFileRequest

export type ContentAnswerResponse = {
    id: string
    urlFile: string
}

export type ContentAnswerTeacherResponse = {
    id: string,
    name: string,
    email: string,
    fileUrl: string
}