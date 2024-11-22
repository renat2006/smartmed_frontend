import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ModeToggle } from "@/components/mode-toggle/mode-toggle"
import { SearchForm } from "@/components/SearchForm/SearchForm"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React, { useState } from "react"
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay, addDays } from "date-fns"
import { ru } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import "react-big-calendar/lib/css/react-big-calendar.css"


const locales = {
  ru,
}

const localizer = dateFnsLocalizer({
  format: (date, formatStr) => format(date, formatStr, { locale: ru }),
  parse: (dateString, formatString) =>
      parse(dateString, formatString, new Date(), { locale: ru }),
  startOfWeek: (date) => startOfWeek(date, { locale: ru }),
  getDay: (date) => getDay(date),
  locales,
})

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV")
  }

  const goToNext = () => {
    toolbar.onNavigate("NEXT")
  }

  const goToToday = () => {
    toolbar.onNavigate("TODAY")
  }

  const label = () => {
    const { date, view } = toolbar
    let label = ""
    if (view === "month") {
      label = format(date, "LLLL yyyy", { locale: ru })
    } else if (view === "week") {
      const start = startOfWeek(date, { locale: ru })
      const end = addDays(start, 6)
      label = `${format(start, "d MMM", { locale: ru })} - ${format(end, "d MMM", {
        locale: ru,
      })}`
    } else if (view === "day") {
      label = format(date, "d MMMM yyyy", { locale: ru })
    }
    return label.charAt(0).toUpperCase() + label.slice(1)
  }

  return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={goToBack}>
            <ChevronLeftIcon />
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Сегодня
          </Button>
          <Button variant="outline" onClick={goToNext}>
            <ChevronRightIcon />
          </Button>
        </div>
        <span className="text-lg font-bold">{label()}</span>
      </div>
  )
}

export const PatientLog = () => {
  const [view, setView] = useState("week")
  const events = [
    // события
  ]

  return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 justify-between items-center gap-2 border-b px-4">
            <div className="flex h-16 shrink-0 items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Основные</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Календарь записей</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ModeToggle />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <SearchForm />
            <div className="flex justify-between mb-4">
              <h2 className="text-3xl font-semibold tracking-tight">
                Календарь записей
              </h2>
              {/* <DatePickerWithRange /> */}
            </div>
            <Tabs defaultValue="week" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="day" onClick={() => setView("day")}>
                  День
                </TabsTrigger>
                <TabsTrigger value="week" onClick={() => setView("week")}>
                  Неделя
                </TabsTrigger>
                <TabsTrigger value="month" onClick={() => setView("month")}>
                  Месяц
                </TabsTrigger>
              </TabsList>
            </Tabs>

              <BigCalendar
                  localizer={localizer}
                  events={events}
                  view={view}
                  onView={() => {}}
                  selectable
                  style={{ height: "80vh" }}
                  onSelectEvent={(event) => {
                    // Обработка события
                  }}
                  onSelectSlot={(slotInfo) => {
                    // Обработка выбора слота
                  }}
                  components={{
                    toolbar: CustomToolbar,
                  }}
                  messages={{
                    date: "Дата",
                    time: "Время",
                    event: "Событие",
                    allDay: "Весь день",
                    week: "Неделя",
                    work_week: "Рабочая неделя",
                    day: "День",
                    month: "Месяц",
                    previous: "Назад",
                    next: "Вперёд",
                    yesterday: "Вчера",
                    tomorrow: "Завтра",
                    today: "Сегодня",
                    agenda: "Повестка дня",
                    noEventsInRange: "Нет событий в данном промежутке.",
                    showMore: (total) => `+ Ещё (${total})`,
                  }}
                  className="rounded-lg shadow-lg p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

        </SidebarInset>
      </SidebarProvider>
  )
}
