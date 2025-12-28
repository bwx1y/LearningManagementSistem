import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {ContentAnswerResponse} from "@/schema/content-schema";
import {toast} from "sonner";
import {UploadService} from "@/service/upload-service";
import ModuleService from "@/service/module-service";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ExternalLink, FileText} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

const MAX_FILE_SIZE = 2 * 1024 * 1024
export function ContentAnswerUserPage() {
    const router = useRouter()
    const {id: course, module, content} = useParams()

    const [allowUpload, setAllowUpload] = useState<ContentAnswerResponse | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [canSubmit, setCanSubmit] = useState<boolean>(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] ?? null

        if (!selectedFile) return

        if (selectedFile.size > MAX_FILE_SIZE) {
            toast.error("Maximum file size 2MB")
            e.target.value = ""
            setFile(null)
            setCanSubmit(false)
            return
        }

        setFile(selectedFile)
        setCanSubmit(!!selectedFile)
    }

    const handleSubmit = async () => {
        if (!file) return

        const resultUpload = await UploadService.uploadFile(file)

        if (resultUpload && course && module && content) {
            const result = await ModuleService.saveContentAnswer(course.toString(), module.toString(), content.toString(), resultUpload)
            setAllowUpload(result)
        }

        // reset (opsional)
        setFile(null)
        setCanSubmit(false)
    }

    const getFileName = (fileUrl: string): string => {
        return fileUrl.split("/").pop() ?? "file"
    }

    useEffect(() => {
        if (course && module && content) {
            ModuleService.getContentAnswers(course.toString(), module.toString(), content.toString())
                .then(setAllowUpload)
        }
    }, [course, module, content])

    return (
        <div className="flex h-[90%] items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Upload Answers</CardTitle>
                    <CardDescription>
                        Upload the answer file to complete this task.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {allowUpload ? (
                        /* ===================== */
                        /* FILE SUDAH ADA */
                        /* ===================== */
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Uploaded File</label>

                            <div className="flex items-center mt-2 justify-between rounded-md border p-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-6 w-6 text-muted-foreground"/>
                                    <span className="text-sm font-medium">{getFileName(allowUpload.urlFile)}</span>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(allowUpload?.urlFile, "_blank")}
                                >
                                    <ExternalLink className="mr-2 h-4 w-4"/>
                                    View
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* ===================== */
                        /* BELUM ADA FILE */
                        /* ===================== */
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">File</label>
                                <Input
                                    className="mt-2"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Free file format, maximum 2mb
                                </p>
                            </div>

                            {file && (
                                <div className="rounded-md border p-3 text-sm">
                                    <span className="font-medium">Selected file:</span>{" "}
                                    <span className="text-muted-foreground">{file.name}</span>
                                </div>
                            )}
                        </>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Back
                        </Button>

                        {!allowUpload && (<Button
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                        >
                            Submit
                        </Button>)}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}