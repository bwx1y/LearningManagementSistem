"use client"

import AuthService from "@/service/auth-service";
import {Role} from "@/schema/enum/role";
import {ContentAnswerUserPage} from "@/app/(main)/course/[id]/[module]/[content]/user-page";
import {ContentAnswerTeacherPage} from "@/app/(main)/course/[id]/[module]/[content]/teacher-page";

export default function ContentAnswerPage() {
    const {data: user, isLoading} = AuthService.me()
    
    if (isLoading) return <>Loading</>
    
    switch (user?.role) {
        case Role.Student: 
            return <ContentAnswerUserPage />
        
        default:
            return <ContentAnswerTeacherPage />
    }
}
