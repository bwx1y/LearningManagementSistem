import {EnrollmentRequest, EnrollmentResponse} from "@/schema/enrollment-schema";
import {api} from "@/lib/api";
import {toast} from "sonner";
import {AxiosError} from "axios";

class Service {
    public getUser(courseId: string): Promise<EnrollmentResponse[]> {
        return api.get<EnrollmentResponse[]>(`Course/${courseId}/User`)
            .then((response) => response.data)
    }

    public async create(courseId: string, request: EnrollmentRequest): Promise<void> {
        await api.post<EnrollmentRequest, unknown>(`Course/${courseId}/User`, request)
            .catch((error: AxiosError) => {
                error.parse!().map((item) => toast.error(item))
                
                throw error
            })
    }

    public async delete(courseId: string, userId: string): Promise<void> {
        await api.delete(`Course/${courseId}/User/${userId}`)
            .then(() => toast.success("Successfully deleted!"));
    }
}

export const EnrollmentService = new Service();