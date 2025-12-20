"use client"

import ModuleService from "@/service/module-service";
import SelectionAlert, {SelectionAlertResult} from "@/components/selection-alert";
import {ContentResponse} from "@/schema/content-schema";
import {useState} from "react";
import {Item, ItemActions, ItemContent, ItemTitle} from "@/components/ui/item";
import {ContentType} from "@/schema/enum/content-type";
import {Trash} from "lucide-react";
import {Role} from "@/schema/enum/role";
import AuthService from "@/service/auth-service";
import {Button} from "@/components/ui/button";
import Link from "next/link";

enum ButtonType {
    Delete
}

interface CardModuleContentProps {
    moduleId: string;
    courserId: string;
    content: ContentResponse;
    onResult: () => void
}

export function CardModuleContent(props: CardModuleContentProps) {
    const {data: user} = AuthService.me()
    const [action, setAction] = useState<ButtonType | null>(null)

    if (action == ButtonType.Delete) return <SelectionAlert
        open={action == ButtonType.Delete}
        description={`Are you sure you want to delete this content?`}
        title={"Delete"}
        onResult={(value) => {
            if (value == SelectionAlertResult.accepted) {
                ModuleService.deleteContent(props.courserId, props.moduleId, props.content.id)
                    .then(props.onResult);
            }
            setAction(null);
        }}
    />

    switch (props.content.type) {
        case ContentType.Link:
            return <Item variant="outline" className="mb-4">
                <ItemContent>
                    <ItemTitle>{props.content.textContent}</ItemTitle>
                </ItemContent>
                <ItemActions>
                    <Button variant="outline"><Link href={props.content.linkUrl || ""}>Go</Link></Button>
                    {user?.role == Role.Teacher && (
                        <Button onClick={() => setAction(ButtonType.Delete)} variant="outline"><Trash/></Button>)}
                </ItemActions>
            </Item>
        case ContentType.Quiz:
            return <Item variant="outline" className="mb-4">
                <ItemContent>
                    <ItemTitle>{props.content.textContent}</ItemTitle>
                </ItemContent>
                <ItemActions>

                    <Button variant="outline" asChild>
                        <Link
                            href={user?.role == Role.Teacher ? `/course/${props.courserId}/module/${props.moduleId}/quiz/${props.content.quizId}/update?type=update` : `/course/${props.courserId}/module/${props.moduleId}/quiz/${props.content.quizId}/view`}>Go</Link>
                    </Button>
                    {user?.role == Role.Teacher && (
                        <Button onClick={() => setAction(ButtonType.Delete)} variant="outline"><Trash/></Button>)}
                </ItemActions>
            </Item>

        case ContentType.Text:
        default:
            return <Item variant="outline" className="mb-4">
                <ItemContent>
                    <ItemTitle>{props.content.textContent}</ItemTitle>
                </ItemContent>
                {user?.role == Role.Teacher && (<ItemActions>
                    <Button onClick={() => setAction(ButtonType.Delete)} variant="outline"><Trash/></Button>
                </ItemActions>)}
            </Item>
    }
}