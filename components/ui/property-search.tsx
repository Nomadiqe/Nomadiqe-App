"use client"

import * as React from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

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
  placeholder = "Search properties...",
}: PropertySearchProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedProperty = properties.find((property) => property.id === value)

  // Filter properties based on search query
  const filteredProperties = React.useMemo(() => {
    if (!searchQuery) return properties

    const query = searchQuery.toLowerCase()
    return properties.filter(
      (property) =>
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query)
    )
  }, [searchQuery, properties])

  // Display value in input
  const displayValue = selectedProperty
    ? `${selectedProperty.title} - ${selectedProperty.location}`
    : searchQuery

  const handleClear = () => {
    onChange(null)
    setSearchQuery("")
  }

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={(e) => {
          setSearchQuery(e.target.value)
          if (selectedProperty) {
            onChange(null)
          }
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full p-3 pr-10 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-nomadiqe-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {selectedProperty && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-md max-h-60 overflow-auto">
          {filteredProperties.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              No property found.
            </div>
          ) : (
            <div className="py-1">
              {filteredProperties.map((property) => (
                <button
                  key={property.id}
                  type="button"
                  onClick={() => {
                    onChange(property.id)
                    setSearchQuery("")
                    setOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-accent flex items-center gap-2 transition-colors"
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === property.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-sm truncate">{property.title}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {property.location}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
