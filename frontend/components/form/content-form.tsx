"use client"

import {AlertDialogProps} from "@radix-ui/react-alert-dialog";
import {CourseResponse} from "@/schema/course-schema";
import {ContentType} from "@/schema/enum/content-type";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {FieldGroup} from "@/components/ui/field";
import {FieldInput, FieldTextarea} from "@/components/ui/field-input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {
    ContentFileRequest,
    ContentLinkRequest,
    ContentRequest,
    ContentResponse,
    ContentTextRequest
} from "@/schema/content-schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import ModuleService from "@/service/module-service";
import SelectionAlert from "@/components/selection-alert";

interface ContentFormProps {
    moduleId: string,
    courseId: string,
    type: ContentType,
    onResult: (data: ContentResponse | null, open: boolean) => void
}

interface SubContentFormProps {
    onCancel: () => void
    onSubmit: (data: ContentRequest) => void
}

function ContentTextForm(props: SubContentFormProps) {
    const {register, handleSubmit, reset, formState: {errors}} = useForm<ContentTextRequest>({
        resolver: zodResolver(ContentTextRequest),
        defaultValues: {
            type: ContentType.Text
        }
    });
    
    return (<form onSubmit={handleSubmit(props.onSubmit)}>
                <FieldGroup className="pb-5">
                    <FieldTextarea title={"Content"} {...register("textContent")} error={errors.textContent}/>
                </FieldGroup>
        
                <AlertDialogFooter>
                    <AlertDialogCancel type="button" onClick={() => {
                        props.onCancel();
                        reset()
                    }}>
                        Cancel
                    </AlertDialogCancel>
                    <Button type="submit">Submit</Button>
                </AlertDialogFooter>
            </form>)
}

function ContentLinkForm(props: SubContentFormProps) {
    const {register, handleSubmit, reset, formState: {errors}} = useForm<ContentLinkRequest>({
        resolver: zodResolver(ContentLinkRequest),
        defaultValues: {
            type: ContentType.Link
        }
    });

    return (<form onSubmit={handleSubmit(props.onSubmit)}>
        <FieldGroup className="pb-5">
            <FieldInput title={"Title"} {...register("textContent")} error={errors.textContent}/>
            <FieldInput type={"url"} title={"Url"} {...register("linkUrl")} error={errors.textContent}/>
        </FieldGroup>

        <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={() => {
                props.onCancel();
                reset()
            }}>
                Cancel
            </AlertDialogCancel>
            <Button type="submit">Submit</Button>
        </AlertDialogFooter>
    </form>)
}

function ContentFileForm(props: SubContentFormProps) {
    const {register, handleSubmit, reset, formState: {errors}} = useForm<ContentFileRequest>({
        resolver: zodResolver(ContentFileRequest),
        defaultValues: {
            type: ContentType.File,
            textContent: "Submission - 1"
        }
    });

    return (<form onSubmit={handleSubmit(props.onSubmit)}>
        
        <FieldGroup className="pb-5">
            <FieldInput title={"Title"} {...register("textContent")} error={errors.textContent}/>
        </FieldGroup>

        <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={() => {
                props.onCancel();
                reset()
            }}>
                Cancel
            </AlertDialogCancel>
            <Button type="submit">Submit</Button>
        </AlertDialogFooter>
    </form>)
}

export default function ContentForm(props: ContentFormProps) {
    const onSubmit = (data: ContentRequest) => {
        ModuleService.createContent(data, props.courseId, props.moduleId)
            .then(result => {
                props.onResult(result, false)
            })
    }
    
    const onCancel = () => {
        props.onResult(null, false)
    }
    
    const renderContent = () => {
        switch (props.type) {
            case ContentType.Link:
                return <ContentLinkForm onCancel={onCancel} onSubmit={onSubmit}/>

            case ContentType.File:
                return <ContentFileForm onCancel={onCancel} onSubmit={onSubmit}/>

            case ContentType.Quiz:
                return <div>Form Quiz</div>;

            case ContentType.Text:
            default:
                return <ContentTextForm onCancel={onCancel} onSubmit={onSubmit} />;
        }
    }
    
    return <AlertDialog open={true}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{ContentType[props.type]} Form</AlertDialogTitle>
                <VisuallyHidden>
                    <AlertDialogDescription>
                        {ContentType[props.type]} Form
                    </AlertDialogDescription>
                </VisuallyHidden>

                {props.type == ContentType.File && (<AlertDialogDescription>
                    This for Submission user
                </AlertDialogDescription>)}
            </AlertDialogHeader>
            {renderContent()}
        </AlertDialogContent>
    </AlertDialog>
}