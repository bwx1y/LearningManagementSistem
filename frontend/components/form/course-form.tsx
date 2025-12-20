"use client"

import {useForm} from "react-hook-form";
import {AlertDialogProps} from "@radix-ui/react-alert-dialog";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {CourseRequest, CourseResponse} from "@/schema/course-schema";
import {FieldInput, FieldSelect, FieldTextarea} from "@/components/ui/field-input";
import {FieldGroup} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import UserService from "@/service/user-service";
import {UserResponse} from "@/schema/user-schema";
import CourseService from "@/service/course-service";
import {toast} from "sonner";

interface CourseFormProps extends AlertDialogProps {
    data?: CourseResponse;
    onOpenChange: (open: boolean) => void;
}

export default function CourseForm({data, ...props}: CourseFormProps) {
    const {register, handleSubmit, reset, formState: {errors}, setValue, watch} = useForm<CourseRequest>({
        resolver: zodResolver(CourseRequest),
        defaultValues: {
            description: data?.description,
            title: data?.title,
            teacherId: data?.teacher.id
        }
    });
    
    const [user, setUser] = useState<UserResponse[]>([])
    
    useEffect(() => {
        UserService.getAll()
            .then((value) => {
                setUser(value)
            })
    }, []);

    const onSubmit = async (values: CourseRequest) => {
        try {
            
            if (!data) await CourseService.create(values)
            else await CourseService.update(data.id, values)
            
            toast.success("Course created successfully.")
        } catch (e) {
            console.error(e)
        }
    };

    return (
        <AlertDialog open={props.open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Course Form</AlertDialogTitle>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup className="pb-5">
                        <FieldInput title="Title" {...register("title")} error={errors.title}/>
                        <FieldTextarea title="Description" {...register("description")} error={errors.description}/>
                        <FieldSelect
                            title={"Teacher"}
                            value={watch("teacherId")}
                            onChange={(value) => setValue("teacherId", value)}
                            options={user.map(item => ({
                                value: item.id,
                                label: `${item.name} (${item.email})`
                            }))}
                        />
                    </FieldGroup>

                    <AlertDialogFooter>
                        <AlertDialogCancel type="button" onClick={() => {
                            props.onOpenChange(!props.open)
                            reset()
                        }}>
                            Cancel
                        </AlertDialogCancel>
                        <Button type="submit">Submit</Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
