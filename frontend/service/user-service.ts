import {api} from "@/lib/api";
import {UserRequest, UserResponse} from "@/schema/user-schema";
import {Role} from "@/schema/enum/role";
import {AxiosError} from "axios";
import {toast} from "sonner";

class UserService {
    public getAll(role: Role | null = null, search: string | null = null): Promise<UserResponse[]> {
        return api.get<UserResponse[]>("User", {
            search: search,
            role: role
        }).then(res => res.data)
            .catch((err: AxiosError) => {
                console.log(err);
                return [];
            })
    }

    public create(request: UserRequest): Promise<UserResponse | null> {
        return api.post<UserRequest, UserResponse>("User", request)
            .then(res => {
                window.location.reload();

                return  res.data
            })
            .catch((err: AxiosError) => {

                const message = err.parse!()
                message.forEach(item => {
                    toast.error(item);
                })

                return null;
            })
    }

    public update(id: string, request: UserRequest): Promise<UserResponse | null> {
        return api.put<UserRequest, UserResponse>(`User/${id}`, request)
            .then(res => {
                window.location.reload();
                
                return  res.data
            })
            .catch((err: AxiosError) => {
                const message = err.parse!()
                message.forEach(item => {
                    toast.error(item);
                })

                return null;
            })
    }

    public async delete(id: string): Promise<void> {
        await api.delete(`User/${id}`)
        window.location.reload()
    }
}

export default new UserService();