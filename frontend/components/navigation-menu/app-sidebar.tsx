"use client"

import * as React from "react"
import {useEffect, useState} from "react"
import {Icon, IconDashboard, IconDatabase, IconInnerShadowTop, IconUsers,} from "@tabler/icons-react"

import {NavMain} from "@/components/navigation-menu/nav-main"
import {NavUser} from "@/components/navigation-menu/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import AuthService from "@/service/auth-service";
import {NavCourse} from "@/components/navigation-menu/nav-course";
import {Role} from "@/schema/enum/role";
import {NavAdmin} from "@/components/navigation-menu/nav-admin";
import CourseService from "@/service/course-service";
import {LibraryBig, ListTodo, LucideIcon} from "lucide-react";

type Menu = {
    name: string;
    url: string;
    icon: LucideIcon | Icon;
}

const data: { [key: string]: Menu[] } = {
    navMain: [
        {
            name: "Dashboard",
            url: "/",
            icon: IconDashboard,
        }
    ],
    navAdmin: [
        {
            name: "Course",
            url: "/course",
            icon: IconDatabase,
        },
        {
            name: "User",
            url: "/user",
            icon: IconUsers,
        }
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {data: user, isLoading} = AuthService.me()
    const [menu, setMenu] = useState<Menu[]>([])

    useEffect(() => {
        if (user?.role != Role.Student) {
            CourseService.getAll()
                .then(({data}) => {
                    setMenu(data.map(item => ({
                        url: `/course/${item.id}`,
                        icon: LibraryBig,
                        name: item.title
                    })))
                })
        }
    }, [isLoading])


    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <a href="/">
                                <IconInnerShadowTop className="!size-5"/>
                                <span className="text-base font-semibold">LMS</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data['navMain']}/>
                {user && user.role === Role.Admin ? <NavAdmin items={data["navAdmin"]}/> : <NavCourse items={menu}/>}
            </SidebarContent>
            <SidebarFooter>
                {user && <NavUser user={user}/>}
            </SidebarFooter>
        </Sidebar>
    )
}
