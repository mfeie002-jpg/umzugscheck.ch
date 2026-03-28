import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { 
  Calendar as CalendarIcon, MapPin, Clock, Users, Truck, 
  CheckCircle2, AlertCircle, Package, ArrowRight
} from "lucide-react";

interface Move {
  id: string;
  customer: string;
  fromAddress: string;
  toAddress: string;
  date: string;
  status: "unassigned" | "assigned" | "in_progress" | "completed";
  assignedTeam: string | null;
  estimatedHours: number;
  priority: "normal" | "high" | "urgent";
}

interface Team {
  id: string;
  name: string;
  members: string[];
  vehicle: string;
  available: boolean;
}

const AdminMoveAssignment = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const teams: Team[] = [
    { id: "team1", name: "Team Alpha", members: ["Hans", "Peter", "Marco"], vehicle: "LKW 1", available: true },
    { id: "team2", name: "Team Beta", members: ["Thomas", "Stefan"], vehicle: "LKW 2", available: true },
    { id: "team3", name: "Team Gamma", members: ["Michael", "David", "Lars"], vehicle: "LKW 3", available: false },
    { id: "team4", name: "Team Delta", members: ["Andreas", "Reto"], vehicle: "Transporter 1", available: true }
  ];

  const [moves, setMoves] = useState<Move[]>([
    {
      id: "m1",
      customer: "Familie Müller",
      fromAddress: "Bahnhofstrasse 10, 8001 Zürich",
      toAddress: "Seestrasse 50, 8002 Zürich",
      date: "2024-03-15",
      status: "unassigned",
      assignedTeam: null,
      estimatedHours: 6,
      priority: "normal"
    },
    {
      id: "m2",
      customer: "Firma ABC GmbH",
      fromAddress: "Industriestrasse 100, 8005 Zürich",
      toAddress: "Technopark 1, 8005 Zürich",
      date: "2024-03-15",
      status: "assigned",
      assignedTeam: "team1",
      estimatedHours: 8,
      priority: "high"
    },
    {
      id: "m3",
      customer: "Herr Schmidt",
      fromAddress: "Altstadt 5, 4001 Basel",
      toAddress: "Neuweg 20, 4053 Basel",
      date: "2024-03-16",
      status: "unassigned",
      assignedTeam: null,
      estimatedHours: 4,
      priority: "urgent"
    },
    {
      id: "m4",
      customer: "Frau Weber",
      fromAddress: "Dorfstrasse 15, 8400 Winterthur",
      toAddress: "Gartenweg 8, 8401 Winterthur",
      date: "2024-03-16",
      status: "in_progress",
      assignedTeam: "team2",
      estimatedHours: 5,
      priority: "normal"
    }
  ]);

  const handleAssignTeam = (moveId: string, teamId: string) => {
    setMoves(prev => prev.map(m => 
      m.id === moveId 
        ? { ...m, assignedTeam: teamId, status: "assigned" as const }
        : m
    ));
    const team = teams.find(t => t.id === teamId);
    toast.success(`${team?.name} wurde zugewiesen`);
  };

  const getStatusBadge = (status: Move["status"]) => {
    const variants = {
      unassigned: { color: "bg-yellow-100 text-yellow-800", label: "Nicht zugewiesen" },
      assigned: { color: "bg-blue-100 text-blue-800", label: "Zugewiesen" },
      in_progress: { color: "bg-purple-100 text-purple-800", label: "In Bearbeitung" },
      completed: { color: "bg-green-100 text-green-800", label: "Abgeschlossen" }
    };
    const { color, label } = variants[status];
    return <Badge className={color}>{label}</Badge>;
  };

  const getPriorityBadge = (priority: Move["priority"]) => {
    const variants = {
      normal: { color: "bg-gray-100 text-gray-800", label: "Normal" },
      high: { color: "bg-orange-100 text-orange-800", label: "Hoch" },
      urgent: { color: "bg-red-100 text-red-800", label: "Dringend" }
    };
    const { color, label } = variants[priority];
    return <Badge className={color}>{label}</Badge>;
  };

  const unassignedCount = moves.filter(m => m.status === "unassigned").length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={unassignedCount > 0 ? "border-yellow-300 bg-yellow-50" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className={`h-5 w-5 ${unassignedCount > 0 ? "text-yellow-600" : "text-muted-foreground"}`} />
              <span className="text-2xl font-bold">{unassignedCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">Nicht zugewiesen</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{moves.filter(m => m.status === "assigned").length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Zugewiesen</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{moves.filter(m => m.status === "in_progress").length}</span>
            </div>
            <p className="text-sm text-muted-foreground">In Bearbeitung</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{teams.filter(t => t.available).length}/{teams.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Teams verfügbar</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Teams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Teams
            </CardTitle>
            <CardDescription>Verfügbare Umzugsteams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {teams.map((team) => (
              <div 
                key={team.id}
                className={`p-3 border rounded-lg ${team.available ? "bg-green-50 border-green-200" : "bg-gray-50 opacity-60"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{team.name}</h4>
                  <Badge variant={team.available ? "default" : "secondary"}>
                    {team.available ? "Verfügbar" : "Nicht verfügbar"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Truck className="h-4 w-4" />
                  {team.vehicle}
                </div>
                <div className="flex -space-x-2">
                  {team.members.map((member, idx) => (
                    <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs">{member[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  <span className="ml-2 text-xs text-muted-foreground self-center">
                    {team.members.join(", ")}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Moves List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Umzüge zuweisen
                </CardTitle>
                <CardDescription>Weisen Sie Teams zu anstehenden Umzügen zu</CardDescription>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: de }) : "Datum wählen"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {moves.map((move) => (
              <div 
                key={move.id}
                className="p-4 border rounded-lg hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{move.customer}</h4>
                      {getStatusBadge(move.status)}
                      {getPriorityBadge(move.priority)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      {move.date}
                      <Clock className="h-4 w-4 ml-2" />
                      ~{move.estimatedHours}h
                    </div>
                  </div>
                  
                  {move.status === "unassigned" ? (
                    <Select onValueChange={(teamId) => handleAssignTeam(move.id, teamId)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Team zuweisen" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.filter(t => t.available).map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline">
                      {teams.find(t => t.id === move.assignedTeam)?.name}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{move.fromAddress}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{move.toAddress}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMoveAssignment;
