"use client"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {FieldSelect} from "@/components/ui/field-input";
import {Button} from "@/components/ui/button";
import {EnrollmentRequest, EnrollmentResponse} from "@/schema/enrollment-schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import React, {useEffect, useState} from "react";
import {UserResponse} from "@/schema/user-schema";
import UserService from "@/service/user-service";
import {EnrollmentService} from "@/service/enrollment-service";
import {useParams} from "next/navigation";
import {toast} from "sonner";

interface EnrollmentFormProps {
    open: boolean;
    onChange: (open: boolean, value?: EnrollmentResponse) => void;
}

export function EnrollmentForm(props: EnrollmentFormProps) {
    const {id} = useParams()

    const [user, setUser] = useState<UserResponse[]>([])
    const {handleSubmit, setValue, formState: {errors}, reset, watch} = useForm<EnrollmentRequest>({
        resolver: zodResolver(EnrollmentRequest),
    })

    const onSubmit = (value: EnrollmentRequest) => {
        const entity = user.find(e => e.id == value.userId)
        if (!entity) {
            toast.error("Not found User")
        }
        
        if (id && entity) EnrollmentService.create(id.toString(), value)
            .then(() => props.onChange(false, {
                id: value.userId,
                email: entity.email,
                name: entity.name
            }))
            .catch((error) => props.onChange(false))
    }

    useEffect(() => {
        UserService.getAll().then((data) => setUser(data))
    }, [])

    return <AlertDialog open={props.open}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Enrollment User</AlertDialogTitle>
            </AlertDialogHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldSelect
                    title={"User"}
                    options={user.map(item => ({
                        value: item.id,
                        label: `${item.name} (${item.email})`
                    }))}
                    value={watch("userId")}
                    onChange={(value) => setValue("userId", value)}
                />

                {errors.userId && (<p className="text-red-500 text-sm mt-1">
                    {errors.userId.message}
                </p>)}

                <AlertDialogFooter className="mt-5">
                    <AlertDialogCancel type="button" onClick={() => {
                        reset()
                        props.onChange(false)
                    }}>
                        Cancel
                    </AlertDialogCancel>
                    <Button type="submit">Submit</Button>
                </AlertDialogFooter>
            </form>
        </AlertDialogContent>
    </AlertDialog>
}