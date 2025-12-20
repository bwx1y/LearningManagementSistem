'use client'
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {CourseResponse} from "@/schema/course-schema";
import CourseService from "@/service/course-service";
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

export function CardCourseHeader({id}: {id: string}) {
    const {push} = useRouter();
    const [course, setCourse] = useState<CourseResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        CourseService.getById(id.toString())
            .then((res) => setCourse(res))
            .catch(() => {
                push("/");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="p-8 space-y-6">
                <Skeleton className="h-10 w-[300px]"/>
                <Skeleton className="h-24 w-full"/>
                <Skeleton className="h-12 w-[200px]"/>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Course not found
            </div>
        );
    }
    
    return <Card className="shadow-sm">
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                    {"General"}
                </Badge>
            </div>

            <CardDescription className="mt-4 text-base leading-relaxed">
                {course.description}
            </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
                <span className="font-medium text-lg">Teacher Information</span>
                <div className="flex items-center gap-3">
                    <Badge>{course.teacher.name}</Badge>
                    <span className="text-sm text-muted-foreground">{course.teacher.email}</span>
                </div>
            </div>
        </CardContent>
    </Card>
}