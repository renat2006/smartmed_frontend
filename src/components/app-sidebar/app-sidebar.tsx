"use client"

import * as React from "react"
import {
    Calendar,
    Frame,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    BookUser,
    NotepadText
} from "lucide-react"


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {NavMain} from "@/components/nav-items/nav-main.tsx";
import {NavProjects} from "@/components/nav-items/nav-projects.tsx";
import {NavSecondary} from "@/components/nav-items/nav-secondary.tsx";
import {NavUser} from "@/components/nav-items/nav-user.tsx";

const data = {
    user: {
        name: "Коваленко А. Ш.",
        email: "kovalenko@mail.ru",
        avatar: "",
    },
    navMain: [
        {
            title: "Календарь записей",
            url: "#",
            icon: Calendar,
            isActive: true,
            items: [
                {
                    title: "1",
                    url: "#",
                },
                {
                    title: "2",
                    url: "#",
                },
                {
                    title: "3",
                    url: "#",
                },
            ],
        },
        {
            title: "Журнал пацентов",
            url: "#",
            icon: BookUser,
            items: [
                {
                    title: "1",
                    url: "#",
                },
                {
                    title: "2",
                    url: "#",
                },
                {
                    title: "3",
                    url: "#",
                },
            ],
        },
        {
            title: "Результаты анализов",
            url: "#",
            icon: NotepadText,
            items: [
                {
                    title: "1",
                    url: "#",
                },
                {
                    title: "2",
                    url: "#",
                },
                {
                    title: "3",
                    url: "#",
                },
                {
                    title: "4",
                    url: "#",
                },
            ],
        }



    ],
    navSecondary: [
        {
            title: "Поддержка",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Отзывы",
            url: "#",
            icon: Send,
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <img  src="/assets/logo/logo.svg" alt="Logo" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Voice.MD</span>
                                    <span className="truncate text-xs">Инновационный ассистент</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/*<NavProjects projects={data.projects} />*/}
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
