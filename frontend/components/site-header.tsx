"use client"
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {SidebarTrigger} from "@/components/ui/sidebar"
import {usePathname} from "next/navigation";

const pathFormat = (path: string): string => {
    if (!path || path === "/") return "Dashboard";

    const segments = path.split("/").filter(Boolean); // hapus string kosong

    return segments
        .map((item, i) => {
            // segment pertama: kapital huruf pertama, ganti '-' jadi spasi
            if (i === 0) {
                const formatted = item.replace(/-/g, " ");
                return formatted.charAt(0).toUpperCase() + formatted.slice(1);
            }
            return item;
        })
        .join(" > ");
};


export function SiteHeader() {
    const path = usePathname()
    
    return (
        <header
            className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1"/>
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">{pathFormat(path)}</h1>
            </div>
        </header>
    )
}
