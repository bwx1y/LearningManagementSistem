"use client"

import {type Icon,} from "@tabler/icons-react"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {cn} from "@/lib/utils";
import {usePathname, useRouter} from "next/navigation";
import {LucideIcon} from "lucide-react";

type NavAdmin = {
    items: {
        name: string
        url: string
        icon:  LucideIcon | Icon;
    }[]
}

export function NavAdmin({items}: NavAdmin) {
    const pathname = usePathname()
    const router = useRouter();
    
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
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
        </SidebarGroup>
    )
}
