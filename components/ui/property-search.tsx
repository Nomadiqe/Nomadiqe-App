"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Home } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Property {
  id: string
  title: string
  location: string
}

interface PropertySearchProps {
  properties: Property[]
  value: string | null
  onChange: (value: string | null) => void
  disabled?: boolean
  placeholder?: string
}

export function PropertySearch({
  properties,
  value,
  onChange,
  disabled = false,
  placeholder = "Select a property...",
}: PropertySearchProps) {
  const [open, setOpen] = React.useState(false)

  const selectedProperty = properties.find((property) => property.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <div className="flex items-center space-x-2">
            <Home className="h-4 w-4 shrink-0 opacity-50" />
            <span className={cn(!selectedProperty && "text-muted-foreground")}>
              {selectedProperty
                ? `${selectedProperty.title} - ${selectedProperty.location}`
                : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
        <Command>
          <CommandInput placeholder="Search properties..." />
          <CommandList>
            <CommandEmpty>No property found.</CommandEmpty>
            <CommandGroup>
              {/* Clear selection option */}
              {value && (
                <CommandItem
                  value="clear-selection"
                  onSelect={() => {
                    onChange(null)
                    setOpen(false)
                  }}
                  className="text-muted-foreground"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Clear selection
                </CommandItem>
              )}
              {properties.map((property) => (
                <CommandItem
                  key={property.id}
                  value={`${property.title} ${property.location}`}
                  onSelect={() => {
                    onChange(property.id === value ? null : property.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === property.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{property.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {property.location}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
