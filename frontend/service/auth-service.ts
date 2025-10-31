import {LoginResponse, LoginSchema} from "@/schema/login-schema";
import {api} from "@/lib/api";
import {AxiosError} from "axios";
import { toast } from "sonner"
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";

class AuthService {
    public login(request: LoginSchema, router: ReturnType<typeof useRouter>) {
        api.post<LoginSchema, LoginResponse>("Auth/login", request)
            .then(({data}) => {
                toast.success(`Login successfully ${data.name}`);
                
                Cookies.set("token", data.token);
                
                router.push("/");
                router.refresh();
            })
            .catch((reason: AxiosError) => {
                const res = reason.parse!()[0]
                toast.error(res)
            });
    }
}

export default new AuthService();