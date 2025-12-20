"use client"

import {type Icon} from "@tabler/icons-react"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {usePathname, useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {LucideIcon} from "lucide-react";

type NavMainProps = {
    items: {
        name: string
        url: string
        icon?:  LucideIcon | Icon;
    }[]
}

export function NavMain({items}: NavMainProps) {
    const pathname = usePathname()
    const router = useRouter()
    
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu className="mt-6">
                    {items?.map((item) => {
                        const isActive = pathname === item.url

                        return (
                            <SidebarMenuItem key={item.name}>
                                <SidebarMenuButton
                                    tooltip={item.name}
                                    className={cn(
                                        "flex items-center gap-2",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted hover:text-foreground"
                                    )}
                                    onClick={() => {
                                        if (!isActive) router.push(item.url)
                                    }}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.name}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
