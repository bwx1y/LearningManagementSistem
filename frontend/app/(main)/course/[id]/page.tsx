"use client"

import {useParams} from "next/navigation";
import {CardCourseHeader} from "@/components/card/card-course";
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardAction, CardContent} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {ModuleResponse} from "@/schema/module-schema";
import ModuleService from "@/service/module-service";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {CardModule} from "@/components/card/card-module";
import {ModuleForm} from "@/components/form/module-form";

export default function CourseByIdPage() {
    const {id} = useParams();
    const [module, setModule] = useState<ModuleResponse[]>([]);
    const [createModule, setCreateModule] = useState<boolean>(false)

    useEffect(() => {
        if (id) ModuleService.getAll(id.toString())
            .then((res) => {
                setModule(res)
            })
    }, [id])

    if (!id) return (<div className="p-8 space-y-6">
        <Skeleton className="h-10 w-[300px]"/>
        <Skeleton className="h-24 w-full"/>
        <Skeleton className="h-12 w-[200px]"/>
    </div>)

    return (
        <div className="w-full p-8 grid grid-cols-1 gap-6">
            <CardCourseHeader id={id.toString()}/>
            {module.map((item) => (<CardModule key={item.id} module={item} courseId={id.toString()}/>))}

            {createModule && <ModuleForm
                courseId={id.toString()}
                open={createModule}
                onOpenChange={setCreateModule}
                onSubmit={(value) => {
                     setModule((prev) => [...prev, value])
                    setCreateModule(false)
                }}
            />}

            <Card>
                <CardContent className="flex justify-end w-full">
                    <CardAction>
                        <Button onClick={() => setCreateModule(true)}><Plus/></Button>
                    </CardAction>
                </CardContent>
            </Card>
        </div>
    );
}
