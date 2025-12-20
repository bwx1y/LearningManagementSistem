import {QuizRequest, QuizResponse, QuizUserResponse} from "@/schema/quiz-schema";
import {api} from "@/lib/api";

class QuizService {
    public create(courseId: string, moduleId: string, req: QuizRequest) {
        return api.post<QuizRequest, QuizResponse>(`Course/${courseId}/Module/${moduleId}/Quiz`, req)
            .then(response => response.data)
    }
    
    public get(courseId: string, moduleId: string, quizId: string) {
        return api.get<QuizResponse>(`Course/${courseId}/Module/${moduleId}/Quiz/${quizId}`)
            .then(response => {
                if (response.status == 404) {
                    window.location.href = '/'
                }
                
                return response.data
            })
    }

    public getByUser(courseId: string, moduleId: string, quizId: string) {
        return api.get<QuizUserResponse>(`Course/${courseId}/Module/${moduleId}/Quiz/${quizId}`)
            .then(response => {
                if (response.status == 404) {
                    window.location.href = '/'
                }

                return response.data
            })
    }
    
    public update(courseId: string, moduleId: string, quizId: string, req: QuizRequest) {
        return api.put<QuizRequest, QuizResponse>(`Course/${courseId}/Module/${moduleId}/Quiz/${quizId}`, req)
            .then(response => response.data)
    }
}

export default new QuizService();