"use client"

import {CourseColumns} from "@/app/(main)/course/columns";
import {useEffect, useState} from "react";
import {CourseResponse} from "@/schema/course-schema";
import CourseService from "@/service/course-service";
import {DataTable} from "@/components/data-table";
import CourseForm from "@/components/form/course-form";

export default function CoursePage() {
    const [course, setCourse] = useState<CourseResponse[] | null>(null)
    const [activeForm, setActiveForm] = useState(false)

    useEffect(() => {
        CourseService.getAll().then(({data}) => setCourse(data))
    }, [])

    return (<div className="p-5">
        <CourseForm open={activeForm} onOpenChange={(value) => setActiveForm(value)}/>
        {course && <DataTable columns={CourseColumns} data={course} addButton={() => setActiveForm(true)}/>}
    </div>)
}