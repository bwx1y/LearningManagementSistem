import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {FieldGroup} from "@/components/ui/field";
import {FieldInput} from "@/components/ui/field-input";
import {Button} from "@/components/ui/button";
import {AlertDialogProps} from "@radix-ui/react-alert-dialog";
import {ModuleRequest, ModuleResponse} from "@/schema/module-schema";
import ModuleService from "@/service/module-service";

interface ModuleFormProps extends AlertDialogProps {
    data?: ModuleResponse;
    courseId: string;
    onOpenChange: (open: boolean) => void;
    onSubmit: (value: ModuleResponse) => void
}

export function ModuleForm({data, ...props}: ModuleFormProps) {
    const {register, handleSubmit, reset, formState: {errors},} = useForm<ModuleRequest>({
        resolver: zodResolver(ModuleRequest),
        defaultValues: {
            title: data?.title,
        }
    });

    const onSubmit = async (values: ModuleRequest) => {
        try {
            ModuleService.create(values, props.courseId)
                .then((result) => {
                props.onSubmit(result);
            })
            toast.success("Module created successfully.")
        } catch (e) {
            console.error(e)
        }
    };

    return (
        <AlertDialog open={props.open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Module Form</AlertDialogTitle>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup className="pb-5">
                        <FieldInput title="Title" {...register("title")} error={errors.title}/>
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