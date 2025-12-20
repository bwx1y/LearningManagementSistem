'use client';
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Field, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import React from "react";
import {useForm} from "react-hook-form";
import {LoginSchema} from "@/schema/login-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import AuthService from "@/service/auth-service";
import {useRouter} from "next/navigation";
export function LoginForm(props: React.ComponentProps<"div">) {
    const {register, handleSubmit, formState:{ errors, isSubmitting}} = useForm<LoginSchema>({
        resolver: zodResolver(LoginSchema)
    })
    const router = useRouter()
    
    const onSubmit = (data: LoginSchema) => {
        AuthService.login(data, router)
    }
    
    return (
        <div className={cn("flex flex-col gap-6", props.className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input id="password" type="password" {...register("password")}/>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isSubmitting}>Login</Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
