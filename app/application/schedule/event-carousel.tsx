"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { EventCard } from "./event-card"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarEvent } from "@/app/interfaces"
import { useMediaQuery } from "@/hooks/use-media-query"


interface EventCarouselProps {
  events: CalendarEvent[]
  titles: string[]
  isLoading: boolean
}

export function EventCarousel({ events, titles, isLoading }: EventCarouselProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const itemsPerView = isDesktop ? 4 : 2

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 border border-black-200 rounded-lg p-9">
        {Array.from({ length: itemsPerView }).map((_, i) => (
          <Skeleton key={i} className="h-[125px] rounded-lg" />
        ))}
      </div>
    )
  }

  if (titles.length === 0) {
    return (
      <div className="flex items-center justify-center h-[125px] mb-6 rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">No events found</p>
      </div>
    )
  }

  return (
    <div>
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: itemsPerView,
        }}
        className="mb-6 border border-black-200 rounded-lg p-9"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {titles.map((title, index) => {
            const scheduledEvent = events.find((event) => event.title === title)
            return (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/4">
                <EventCard title={title} event={scheduledEvent} index={index} />
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious className="size-6 mr-6 ml-6" />
        <CarouselNext className="size-6 mr-6 ml-6" />
      </Carousel>
    </div>
  )
}


