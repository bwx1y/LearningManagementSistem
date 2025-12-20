"use client"

import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {ModuleResponse} from "@/schema/module-schema";
import {Item, ItemActions, ItemContent} from "@/components/ui/item";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Plus} from "lucide-react";
import {ContentType} from "@/schema/enum/content-type";
import {useEffect, useState} from "react";
import {ContentResponse} from "@/schema/content-schema";
import ContentForm from "@/components/form/content-form";
import AuthService from "@/service/auth-service";
import {Role} from "@/schema/enum/role";
import {Badge} from "@/components/ui/badge";
import {format, parseISO} from "date-fns";
import {CardModuleContent} from "@/components/card/card-module-content";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

type CardModuleProps = {
    module: ModuleResponse;
    courseId: string;
}

export function CardModule(props: CardModuleProps) {
    const router = useRouter();
    const {data: user} = AuthService.me()
    const [content, setContent] = useState<ContentResponse[]>(props.module.content)
    const [openType, setOpenType] = useState<ContentType | null>(null)
    

    if (openType != null) return <ContentForm
        moduleId={props.module.id}
        courseId={props.courseId}
        type={openType}
        onResult={(data, open) => {
            if (data != null && !open) {
                setContent((prev) => [...prev, data])
            }

            setOpenType(null)
        }}/>

    return (<Card>
        <CardContent>
            <div className="flex items-center justify-between mb-6">
                <CardTitle>{props.module.title}</CardTitle>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                    {format(parseISO(props.module.cratedAt.toString()), "eeee-MM-yyyy HH:mm")}
                </Badge>
            </div>

            {content.map((item) => <CardModuleContent
                moduleId={props.module.id}
                courserId={props.courseId}
                content={item}
                key={item.id}
                onResult={() => {
                    toast.success("Success delete")
                    setContent(prev => prev.filter(f => f.id !== item.id))
                }}
            />)}
            {user?.role == Role.Teacher && (<Item>
                <ItemContent></ItemContent>
                <ItemActions>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline"><Plus/> Add Content</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {Object.keys(ContentType).filter(item => isNaN(Number(item))).map((item) => (
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (ContentType[item as keyof typeof ContentType] == ContentType.Quiz) {
                                            router.push(`/course/${props.courseId}/module/${props.module.id}/quiz`)
                                        } else setOpenType(ContentType[item as keyof typeof ContentType])
                                    }}
                                    key={item}>{item}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ItemActions>
            </Item>)}
        </CardContent>
    </Card>)
}