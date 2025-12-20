"use client"

import {DataTable} from "@/components/data-table";
import {useEffect, useState} from "react";
import {UserColumns} from "@/app/(main)/user/colums";
import {UserResponse} from "@/schema/user-schema";
import UserService from "@/service/user-service";
import UserForm from "@/components/form/user-form";

export default function PageUser() {
    const [user, setUser] = useState<UserResponse[]>([]);
    const [createForm, setCreateForm] = useState<boolean>(false);
    
    const getUser = () => {
        UserService.getAll().then((value) => setUser(value))
    }
    
    useEffect(() => {
        getUser();
    }, [])
    
    return (<div className="p-5">
        <UserForm open={createForm} onOpenChange={(value) => {
            setCreateForm(value);
        }}/>
        <DataTable columns={UserColumns} data={user} addButton={() => {
            setCreateForm(true);
        }}/>
    </div>)
}