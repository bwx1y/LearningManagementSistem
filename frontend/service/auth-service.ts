import {LoginResponse, LoginSchema, MeResponse} from "@/schema/login-schema";
import {api} from "@/lib/api";
import {AxiosError} from "axios";
import {toast} from "sonner"
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";

class AuthService {
    private KEY_CACHE_ME = ["auth", "me"]
    
    public login(request: LoginSchema, router: ReturnType<typeof useRouter>) {
        api.post<LoginSchema, LoginResponse>("Auth/login", request)
            .then(({data}) => {
                toast.success(`Login successfully ${data.name}`);

                Cookies.set("token", data.token);
                Cookies.set("refreshToken", data.refreshToken);

                router.push("/");
                router.refresh();
            })
            .catch((reason: AxiosError) => {
                const res = reason.parse!()[0]
                toast.error(res)
            });
    }

    public me() {
        return useQuery({
            queryKey: this.KEY_CACHE_ME,
            queryFn: async () => api.get<MeResponse>("Auth/me").then((res) => res.data),
            staleTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false
        })
    }   
}

export default new AuthService();