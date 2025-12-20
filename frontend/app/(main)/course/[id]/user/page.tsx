"use client"

import {useParams} from "next/navigation";
import {CardCourseHeader} from "@/components/card/card-course";
import {useEffect, useState} from "react";
import {EnrollmentResponse} from "@/schema/enrollment-schema";
import {EnrollmentService} from "@/service/enrollment-service";
import {DataTable} from "@/components/data-table";
import {EnrollmentColumn} from "@/app/(main)/course/[id]/user/columns";
import {Card, CardContent} from "@/components/ui/card";
import {EnrollmentForm} from "@/components/form/enrollment-form";

export default function EnrollmentPage() {
    const {id} = useParams();
    const [user, setUser] = useState<EnrollmentResponse[]>([])
    const [addForm, setAddForm] = useState<boolean>(false)

    useEffect(() => {
        if (id) EnrollmentService.getUser(id.toString())
            .then((data) => setUser(data))
    }, [id]);

    return <div className="m-5">
        <CardCourseHeader id={id!.toString()}/>

        {addForm && (<EnrollmentForm
            open={addForm}
            onChange={(open, value) => {
                if (value) {
                    setUser((prev) => [...prev, value])
                }
                
                setAddForm(open)
            }}
        />)}

        <Card className="mt-5">
            <CardContent>
                <DataTable columns={EnrollmentColumn} data={user} addButton={() => setAddForm(true)}/>
            </CardContent>
        </Card>
    </div>
}