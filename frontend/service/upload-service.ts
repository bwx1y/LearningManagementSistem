import {api} from "@/lib/api";
import {UploadUrlResponse} from "@/schema/upload-schema";
import {toast} from "sonner";

class Controller {
    private async getUploadUrl(fileName: string) {
        return api.get<UploadUrlResponse>(`Upload/Request?FileName=${fileName}`)
            .then((res) => res.data)
    }
    
    public async uploadFile(file: File): Promise<string | null> {
        const uploadUrl = await this.getUploadUrl(file.name)
        
        const formBody = new FormData();
        Object.entries(uploadUrl.fields).forEach(([key, value]) => {
            formBody.append(key, value)
        })
        formBody.append('file', file)
        
        const result = await fetch(uploadUrl.uploadUrl, {
            method: 'POST',
            body: formBody,
        })

        if (result.ok) {
            toast.success("Upload successful")
        } else {
            toast.error("Upload failed.")
            return null
        }
        
        return uploadUrl.resultUrl
    }
}

export const UploadService = new Controller();