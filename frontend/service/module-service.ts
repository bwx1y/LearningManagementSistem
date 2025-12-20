import {ModuleRequest, ModuleResponse} from "@/schema/module-schema";
import {api} from "@/lib/api";
import {ContentRequest, ContentResponse} from "@/schema/content-schema";
import {QuizRequest, QuizResponse} from "@/schema/quiz-schema";

class ModuleService {

    public getAll(id: string): Promise<ModuleResponse[]> {
        return api.get<ModuleResponse[]>(`Course/${id}/Module`)
            .then(res => res.data)

    }

    public create(request: ModuleRequest, courseId: string): Promise<ModuleResponse> {
        return api.post<ModuleRequest, ModuleResponse>(`Course/${courseId}/Module`, request)
            .then(res => res.data)
    }

    public createContent(req: ContentRequest, courseId: string, moduleId: string): Promise<ContentResponse> {
        return api.post<typeof req, ContentResponse>(`Course/${courseId}/Module/${moduleId}/Content`, req)
            .then(res => res.data)
    }

    public async deleteContent(courseId: string, moduleId: string, id: string): Promise<void> {
        await api.delete(`Course/${courseId}/Module/${moduleId}/Content/${id}`)
    }
}

export default new ModuleService();