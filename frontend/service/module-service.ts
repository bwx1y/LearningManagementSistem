import {ModuleRequest, ModuleResponse} from "@/schema/module-schema";
import {api} from "@/lib/api";
import {
    ContentAnswerResponse,
    ContentAnswerTeacherResponse,
    ContentRequest,
    ContentResponse
} from "@/schema/content-schema";

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

    public async getContentAnswers(courseId: string, moduleId: string, contentId: string): Promise<ContentAnswerResponse | null> {
        return api.get<ContentAnswerResponse | null>(`Course/${courseId}/Module/${moduleId}/Content/${contentId}/Answer`)
            .then(res => res.data)
            .catch(() => null)
    }

    public async getTeacherContentAnswers(courseId: string, moduleId: string, contentId: string): Promise<ContentAnswerTeacherResponse[]> {
        return api.get<ContentAnswerTeacherResponse[]>(`Course/${courseId}/Module/${moduleId}/Content/${contentId}/Answer`)
            .then(res => res.data)
    }

    public async saveContentAnswer(courseId: string, moduleId: string, contentId: string, fileUrl: string) {
        return api.post<{
            urlFile: string
        }, ContentAnswerResponse>(`Course/${courseId}/Module/${moduleId}/Content/${contentId}/Answer`, {
            urlFile: fileUrl,
        }).then(res => res.data)
    }
}

export default new ModuleService();