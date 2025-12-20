import {api} from "@/lib/api";
import {CourseRequest, CourseResponse} from "@/schema/course-schema";
import {AxiosError} from "axios";

class CourseService {
    public getAll() {
        return api.get<CourseResponse[]>("Course");
    }
    
    public getById(id: string): Promise<CourseResponse | null> {
        return api.get<CourseResponse | null>(`Course/${id}`)
            .then(res => res.data)
            .catch((err: AxiosError) => {
                if (err.status == 401) {
                    window.location.href = "/";
                }
                throw err;
            });
    }
    
    public async create(course: CourseRequest) {
        const response = await api.post<CourseRequest, CourseResponse>(`Course`, course);
        window.location.reload();
        return response.data;
    }
    
    public async update(id: string, course: CourseRequest) {
        const response = await api.put<CourseRequest, CourseResponse>(`Course/${id}`, course);
        window.location.reload();
        return response.data;
    }
    
    public async delete(id: string) {
        await api.delete(`Course/${id}`);
        window.location.reload();
    }
}

export default new CourseService();