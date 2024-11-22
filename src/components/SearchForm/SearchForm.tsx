import {Input} from "@/components/ui/input.tsx";
import {Search} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";

export const SearchForm = () => {
  return (
      <div className="relative">
          <Label htmlFor="search" className="sr-only">
              Search
          </Label>
          <Input
              id="search"
              placeholder="Поиск по ФИО"
              className="pl-8"
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
      </div>
  )
}