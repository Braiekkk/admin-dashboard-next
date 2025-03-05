import { Card, CardContent } from "@/components/ui/card"
import { Clock, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import  { CalendarEvent } from "@/app/interfaces"

const pastelColors = [
  "rgba(227, 247, 255)",
  "rgba(254, 243, 199)",
  "rgba(236, 234, 254)",
  "rgba(253, 226, 243)",
  "rgba(223, 246, 255)",
]

interface EventCardProps {
  title: string
  index: number
  event?: CalendarEvent
}

export function EventCard({ title, event, index }: EventCardProps) {
  const isScheduled = !!event
  const hoverColor = pastelColors[index % pastelColors.length]

  return (
    <Card
      className={`h-[140px] w-full transition-colors duration-200 ${
        !isScheduled ? "bg-red-50 border-dashed" : "hover:bg-opacity-100"
      }`}
      style={
        {
          "--hover-color": hoverColor,
        } as React.CSSProperties
      }
    >
      <CardContent
        className={`flex flex-col h-full justify-between p-4 rounded-lg transition-colors duration-200 ${
          isScheduled ? "hover:bg-[var(--hover-color)]" : ""
        }`}
      >
        <div className="space-y-2">
          <h3 className="font-semibold truncate">{title}</h3>
          {isScheduled ? (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <p className="text-xs">
                {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-500">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <p className="text-xs">Date not set up for this event</p>
            </div>
          )}
        </div>
        {isScheduled && <p className="text-xs text-muted-foreground">{format(event.start, "EEEE, MMMM d, yyyy")}</p>}
      </CardContent>
    </Card>
  )
}

