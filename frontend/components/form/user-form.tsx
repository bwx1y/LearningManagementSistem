"use client"

import {AlertDialogProps} from "@radix-ui/react-alert-dialog";
import {UserRequest, UserResponse} from "@/schema/user-schema";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {FieldGroup} from "@/components/ui/field";
import {FieldInput, FieldSelect} from "@/components/ui/field-input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Role} from "@/schema/enum/role";
import UserService from "@/service/user-service";

interface UserFormProps extends AlertDialogProps {
    data?: UserResponse;
    onOpenChange: (open: boolean) => void;
}

export default function UserForm(props: UserFormProps) {
    const {register, handleSubmit, reset, formState: {errors}, setValue, watch, setError} = useForm<UserRequest>({
        resolver: zodResolver(UserRequest),
        defaultValues: {
            ...props.data
        },
    });

    const onSubmit = async (values: UserRequest) => {
        if (!props.data) {
            if (values.password == undefined) {
                setError("password", {message: "Password is required"})
                return;
            }

            if (values.confirmPassword == undefined) {
                setError("password", {message: "confirm password is required"})
                return;
            }
            
            const response = await UserService.create({...values});
            if (response) {
                props.onOpenChange(true)
            }
        }  
        else {
            const response = await UserService.update(props.data.id, values);
            if (response) {
                props.onOpenChange(true)
            }
        }
    }

    return <AlertDialog open={props.open}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Course Form</AlertDialogTitle>
            </AlertDialogHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className="pb-5">
                    <FieldInput title={"Name"} {...register("name")} error={errors.name}/>
                    <FieldInput title={"Email"} {...register("email")} error={errors.email} type={"email"}/>
                    <FieldSelect
                        title="Role"
                        options={Object.keys(Role)
                            .filter(key => isNaN(Number(key))) // ambil hanya nama enum, bukan nilai angka
                            .map(key => ({
                                label: key,
                                value: key,
                            }))}
                        value={watch("role") ? Role[watch("role")]?.toString() : ""}
                        onChange={(value) => {
                            const enumValue = Role[value as keyof typeof Role];
                            setValue("role", enumValue);
                        }}
                    />
                    <p>{errors.role?.message}</p>
                    <FieldInput title={"Password"} {...register("password")} error={errors.password} type={"password"}/>
                    <FieldInput title={"Confirm Password"} {...register("confirmPassword")} error={errors.confirmPassword} type={"password"}/>
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
}