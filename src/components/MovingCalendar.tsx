import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Calendar as CalendarIcon, Clock, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: "task" | "appointment" | "deadline" | "reminder";
  completed: boolean;
}

const eventTypeColors = {
  task: "bg-blue-100 text-blue-800 border-blue-200",
  appointment: "bg-green-100 text-green-800 border-green-200",
  deadline: "bg-red-100 text-red-800 border-red-200",
  reminder: "bg-orange-100 text-orange-800 border-orange-200",
};

const eventTypeLabels = {
  task: "Aufgabe",
  appointment: "Termin",
  deadline: "Frist",
  reminder: "Erinnerung",
};

export const MovingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Kartons besorgen",
      date: new Date(),
      time: "10:00",
      type: "task",
      completed: false,
    },
    {
      id: "2",
      title: "Umzugsfirma Termin",
      date: new Date(Date.now() + 86400000 * 3),
      time: "14:00",
      type: "appointment",
      completed: false,
    },
    {
      id: "3",
      title: "Kündigung Wohnung",
      date: new Date(Date.now() + 86400000 * 7),
      time: "00:00",
      type: "deadline",
      completed: false,
    },
    {
      id: "4",
      title: "Nachsendeauftrag einrichten",
      date: new Date(Date.now() + 86400000 * 5),
      time: "09:00",
      type: "reminder",
      completed: false,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "10:00",
    type: "task" as CalendarEvent["type"],
  });

  const eventsForDate = (date: Date) =>
    events.filter(
      (e) => e.date.toDateString() === date.toDateString()
    );

  const selectedDateEvents = selectedDate ? eventsForDate(selectedDate) : [];

  const datesWithEvents = events.map((e) => e.date);

  const addEvent = () => {
    if (!selectedDate || !newEvent.title) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      type: newEvent.type,
      completed: false,
    };

    setEvents([...events, event]);
    setNewEvent({ title: "", time: "10:00", type: "task" });
    setIsDialogOpen(false);
  };

  const toggleComplete = (id: string) => {
    setEvents(
      events.map((e) =>
        e.id === id ? { ...e, completed: !e.completed } : e
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Umzugskalender
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={de}
              className="rounded-md border"
              modifiers={{
                hasEvent: datesWithEvents,
              }}
              modifiersStyles={{
                hasEvent: {
                  fontWeight: "bold",
                  backgroundColor: "hsl(var(--primary) / 0.1)",
                },
              }}
            />
          </div>

          {/* Events for selected date */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {selectedDate
                  ? format(selectedDate, "EEEE, d. MMMM", { locale: de })
                  : "Datum auswählen"}
              </h3>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" disabled={!selectedDate}>
                    <Plus className="h-4 w-4 mr-1" />
                    Hinzufügen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Neuer Eintrag</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="title">Titel</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, title: e.target.value })
                        }
                        placeholder="z.B. Kartons packen"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Uhrzeit</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newEvent.time}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, time: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Typ</Label>
                      <Select
                        value={newEvent.type}
                        onValueChange={(value: CalendarEvent["type"]) =>
                          setNewEvent({ ...newEvent, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="task">Aufgabe</SelectItem>
                          <SelectItem value="appointment">Termin</SelectItem>
                          <SelectItem value="deadline">Frist</SelectItem>
                          <SelectItem value="reminder">Erinnerung</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addEvent} className="w-full">
                      Hinzufügen
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {selectedDateEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Keine Einträge für diesen Tag
                </p>
              ) : (
                selectedDateEvents
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border ${
                        event.completed ? "opacity-50" : ""
                      } ${eventTypeColors[event.type]}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={event.completed}
                            onChange={() => toggleComplete(event.id)}
                            className="mt-1"
                          />
                          <div>
                            <p
                              className={`font-medium ${
                                event.completed ? "line-through" : ""
                              }`}
                            >
                              {event.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs">{event.time}</span>
                              <Badge variant="outline" className="text-xs">
                                {eventTypeLabels[event.type]}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteEvent(event.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Upcoming events summary */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold mb-3">Anstehende Termine</h4>
          <div className="flex flex-wrap gap-2">
            {events
              .filter((e) => e.date >= new Date() && !e.completed)
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 5)
              .map((event) => (
                <Badge
                  key={event.id}
                  variant="outline"
                  className={eventTypeColors[event.type]}
                >
                  {format(event.date, "dd.MM")} - {event.title}
                </Badge>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
