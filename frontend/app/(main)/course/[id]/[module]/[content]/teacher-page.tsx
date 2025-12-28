"use client"

import {Card, CardContent} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {ContentAnswerTeacherResponse} from "@/schema/content-schema";
import {useParams} from "next/navigation";
import ModuleService from "@/service/module-service";
import {DataTable} from "@/components/data-table";
import {ContentAnswerColumns} from "@/app/(main)/course/[id]/[module]/[content]/columns";

export function ContentAnswerTeacherPage() {
    const {id: course, module, content} = useParams()
    const [data, setData] = useState<ContentAnswerTeacherResponse[]>([])
    
    useEffect(() => {
        if (course && module && content) {
            ModuleService.getTeacherContentAnswers(course.toString(), module.toString(), content.toString())
                .then(setData)
        }
    }, [course, module, content])
    
    return <div className="m-5">
        <Card>
            <CardContent>
                <DataTable columns={ContentAnswerColumns} data={data}/>
            </CardContent>
        </Card>
    </div>
} 