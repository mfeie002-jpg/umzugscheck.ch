import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Users, Search, MoreHorizontal, Mail, Phone, Calendar, 
  Shield, UserPlus, Eye, Edit, Trash2, CheckCircle2, XCircle
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "moderator" | "user";
  status: "active" | "inactive" | "pending";
  movesCount: number;
  joinedAt: string;
  lastActive: string;
}

const AdminUserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Sample users data
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Max Mustermann",
      email: "max@example.com",
      phone: "+41 76 568 13 02",
      role: "user",
      status: "active",
      movesCount: 3,
      joinedAt: "2024-01-15",
      lastActive: "2024-03-10"
    },
    {
      id: "2",
      name: "Anna Schmidt",
      email: "anna@example.com",
      phone: "+41 78 234 56 78",
      role: "user",
      status: "active",
      movesCount: 1,
      joinedAt: "2024-02-20",
      lastActive: "2024-03-12"
    },
    {
      id: "3",
      name: "Thomas Weber",
      email: "thomas@example.com",
      phone: "+41 76 345 67 89",
      role: "moderator",
      status: "active",
      movesCount: 0,
      joinedAt: "2023-11-01",
      lastActive: "2024-03-14"
    },
    {
      id: "4",
      name: "Sarah Fischer",
      email: "sarah@example.com",
      phone: "+41 77 456 78 90",
      role: "user",
      status: "pending",
      movesCount: 0,
      joinedAt: "2024-03-10",
      lastActive: "2024-03-10"
    },
    {
      id: "5",
      name: "Michael Braun",
      email: "michael@example.com",
      phone: "+41 79 567 89 01",
      role: "user",
      status: "inactive",
      movesCount: 2,
      joinedAt: "2023-06-15",
      lastActive: "2023-12-20"
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      admin: { color: "bg-red-100 text-red-800", label: "Admin" },
      moderator: { color: "bg-blue-100 text-blue-800", label: "Moderator" },
      user: { color: "bg-gray-100 text-gray-800", label: "Benutzer" }
    };
    const { color, label } = variants[role] || variants.user;
    return <Badge className={color}>{label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: React.ReactNode }> = {
      active: { color: "text-green-600", icon: <CheckCircle2 className="h-4 w-4" /> },
      inactive: { color: "text-gray-400", icon: <XCircle className="h-4 w-4" /> },
      pending: { color: "text-yellow-600", icon: <Calendar className="h-4 w-4" /> }
    };
    const { color, icon } = variants[status] || variants.pending;
    return <span className={`flex items-center gap-1 ${color}`}>{icon}</span>;
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    toast.success(`Rolle wurde aktualisiert`);
  };

  const handleDeleteUser = (userId: string) => {
    toast.success("Benutzer wurde gelöscht");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach Name oder E-Mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Rolle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Rollen</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">Benutzer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Benutzer hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuen Benutzer hinzufügen</DialogTitle>
              <DialogDescription>
                Erstellen Sie einen neuen Benutzer-Account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Max Mustermann" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" type="email" placeholder="max@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" placeholder="+41 76 568 13 02" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rolle</Label>
                <Select defaultValue="user">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Benutzer</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={() => {
                toast.success("Benutzer wurde erstellt");
                setIsAddUserOpen(false);
              }}>
                Erstellen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{users.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Gesamt</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{users.filter(u => u.status === "active").length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Aktiv</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{users.filter(u => u.status === "pending").length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Ausstehend</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{users.filter(u => u.role === "admin" || u.role === "moderator").length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Admins/Mods</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Benutzerliste</CardTitle>
          <CardDescription>
            {filteredUsers.length} Benutzer gefunden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{user.name}</h4>
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {user.phone}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.movesCount} Umzüge • Beigetreten: {user.joinedAt}
                    </p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Details anzeigen
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Bearbeiten
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Shield className="h-4 w-4 mr-2" />
                      Rolle ändern
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Löschen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
