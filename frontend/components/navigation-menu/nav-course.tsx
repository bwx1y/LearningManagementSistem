"use client"

import {type Icon, IconDots, IconFolder,} from "@tabler/icons-react"

import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {LucideIcon, User2} from "lucide-react";
import AuthService from "@/service/auth-service";
import {Role} from "@/schema/enum/role";

type NavCourse = {
    items: {
        name: string
        url: string
        icon: LucideIcon | Icon;
    }[]
}

export function NavCourse({items}: NavCourse) {
    const {data: user} = AuthService.me()
    const {isMobile} = useSidebar()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Course</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                                <item.icon/>
                                <span>{item.name}</span>
                            </a>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction
                                    showOnHover
                                    className="data-[state=open]:bg-accent rounded-sm"
                                >
                                    <IconDots/>
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-24 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem asChild>
                                    <a href={item.url}>
                                        <IconFolder/>
                                        <span>Open</span>
                                    </a>
                                </DropdownMenuItem>
                                {(user?.role == Role.Admin) && (<DropdownMenuItem asChild>
                                    <a href={item.url + "/user"}>
                                        <User2/>
                                        <span>User</span>
                                    </a>
                                </DropdownMenuItem>)}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
