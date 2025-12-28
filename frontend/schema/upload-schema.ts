export type UploadUrlResponse = {
    uploadUrl: string
    resultUrl: string
    fields: {
        bucket: string
        key: string
        "x-amz-algorithm": string
        "x-amz-credential": string
        "x-amz-date": string
        policy: string
        "x-amz-signature": string
    }
}