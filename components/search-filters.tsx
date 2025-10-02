"use client"

export function SearchFilters() {
  return (
    <section className="bg-muted py-6 border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price Range</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2">
              <option>Any price</option>
              <option>€0 - €50</option>
              <option>€50 - €100</option>
              <option>€100 - €200</option>
              <option>€200+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Property Type</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2">
              <option>Any type</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Villa</option>
              <option>Cabin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amenities</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2">
              <option>Any amenities</option>
              <option>WiFi</option>
              <option>Pool</option>
              <option>Kitchen</option>
              <option>Parking</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2">
              <option>Any rating</option>
              <option>4.5+ stars</option>
              <option>4.0+ stars</option>
              <option>3.5+ stars</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  )
}