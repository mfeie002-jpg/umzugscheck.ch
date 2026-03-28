import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Users, Plus, Mail, Phone, Shield, Edit, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'driver' | 'support';
  avatar?: string;
  isActive: boolean;
  lastActive?: string;
}

interface Props {
  providerId: string;
}

export const TeamManagement = ({ providerId }: Props) => {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Max Müller',
      email: 'max@firma.ch',
      phone: '+41 79 123 45 67',
      role: 'admin',
      isActive: true,
      lastActive: 'Vor 5 Minuten',
    },
    {
      id: '2',
      name: 'Anna Schmidt',
      email: 'anna@firma.ch',
      phone: '+41 79 234 56 78',
      role: 'manager',
      isActive: true,
      lastActive: 'Vor 2 Stunden',
    },
    {
      id: '3',
      name: 'Peter Weber',
      email: 'peter@firma.ch',
      role: 'driver',
      isActive: true,
      lastActive: 'Heute',
    },
    {
      id: '4',
      name: 'Lisa Brunner',
      email: 'lisa@firma.ch',
      role: 'support',
      isActive: false,
      lastActive: 'Vor 3 Tagen',
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'driver' as TeamMember['role'],
  });

  const roleLabels: Record<TeamMember['role'], string> = {
    admin: 'Administrator',
    manager: 'Manager',
    driver: 'Fahrer',
    support: 'Support',
  };

  const roleColors: Record<TeamMember['role'], string> = {
    admin: 'bg-red-100 text-red-700',
    manager: 'bg-blue-100 text-blue-700',
    driver: 'bg-green-100 text-green-700',
    support: 'bg-purple-100 text-purple-700',
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast.error('Name und E-Mail sind erforderlich');
      return;
    }

    setMembers(prev => [...prev, {
      ...newMember,
      id: Date.now().toString(),
      isActive: true,
    }]);

    setNewMember({ name: '', email: '', phone: '', role: 'driver' });
    setIsAddDialogOpen(false);
    toast.success('Teammitglied hinzugefügt');
  };

  const toggleMemberStatus = (id: string) => {
    setMembers(prev => prev.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    ));
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    toast.success('Teammitglied entfernt');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team-Verwaltung
            </CardTitle>
            <CardDescription>Verwalten Sie Ihre Teammitglieder und Zugriffsrechte</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Mitglied hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neues Teammitglied</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input 
                    value={newMember.name}
                    onChange={e => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Vor- und Nachname"
                  />
                </div>
                <div>
                  <Label>E-Mail</Label>
                  <Input 
                    type="email"
                    value={newMember.email}
                    onChange={e => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@firma.ch"
                  />
                </div>
                <div>
                  <Label>Telefon (optional)</Label>
                  <Input 
                    value={newMember.phone}
                    onChange={e => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+41 79 123 45 67"
                  />
                </div>
                <div>
                  <Label>Rolle</Label>
                  <Select 
                    value={newMember.role}
                    onValueChange={v => setNewMember(prev => ({ ...prev, role: v as TeamMember['role'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleAddMember}>
                    Hinzufügen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold">{members.length}</p>
            <p className="text-xs text-muted-foreground">Gesamt</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {members.filter(m => m.isActive).length}
            </p>
            <p className="text-xs text-muted-foreground">Aktiv</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold">
              {members.filter(m => m.role === 'admin').length}
            </p>
            <p className="text-xs text-muted-foreground">Admins</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-2xl font-bold">
              {members.filter(m => m.role === 'driver').length}
            </p>
            <p className="text-xs text-muted-foreground">Fahrer</p>
          </div>
        </div>

        {/* Team List */}
        <div className="space-y-3">
          {members.map(member => (
            <div 
              key={member.id}
              className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                member.isActive ? 'bg-background' : 'bg-muted/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{member.name}</span>
                    <Badge className={roleColors[member.role]}>
                      {roleLabels[member.role]}
                    </Badge>
                    {!member.isActive && (
                      <Badge variant="secondary">Inaktiv</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {member.phone}
                      </div>
                    )}
                  </div>
                  {member.lastActive && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Zuletzt aktiv: {member.lastActive}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch 
                  checked={member.isActive}
                  onCheckedChange={() => toggleMemberStatus(member.id)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Bearbeiten
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Shield className="h-4 w-4 mr-2" />
                      Rechte ändern
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => removeMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Entfernen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        {/* Role Permissions Info */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Rollen & Berechtigungen
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <Badge className={roleColors.admin}>Administrator</Badge>
              <p className="mt-1 text-muted-foreground">Voller Zugriff auf alle Funktionen</p>
            </div>
            <div>
              <Badge className={roleColors.manager}>Manager</Badge>
              <p className="mt-1 text-muted-foreground">Leads verwalten, Team koordinieren</p>
            </div>
            <div>
              <Badge className={roleColors.driver}>Fahrer</Badge>
              <p className="mt-1 text-muted-foreground">Zugewiesene Aufträge einsehen</p>
            </div>
            <div>
              <Badge className={roleColors.support}>Support</Badge>
              <p className="mt-1 text-muted-foreground">Kundenanfragen bearbeiten</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
