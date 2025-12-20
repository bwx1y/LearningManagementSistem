import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

export enum SelectionAlertResult {
    accepted = "accepted",
    rejected = "rejected",
}

interface Props {
    open: boolean;
    title: string;
    description?: string | null;
    onResult: (value: SelectionAlertResult) => void;
}

export default function SelectionAlert({title, description, open, onResult}: Props) {
    return <AlertDialog open={open}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                {description != null && (<AlertDialogDescription>{description}</AlertDialogDescription>)}
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel
                    onClick={() => onResult(SelectionAlertResult.rejected)}>No</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => onResult(SelectionAlertResult.accepted)}>Yes</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}