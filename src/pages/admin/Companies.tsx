import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Star, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data - in production this would come from the database
const mockCompanies = [
  {
    id: "1",
    name: "SwissMove AG",
    logo: "🚛",
    email: "info@swissmove.ch",
    phone: "+41 44 123 45 67",
    rating: 4.8,
    verified: true,
    service_areas: ["Zürich", "Bern", "Basel"],
    price_level: "CHF CHF",
  },
  {
    id: "2",
    name: "AlpTransport GmbH",
    logo: "🏔️",
    email: "contact@alptransport.ch",
    phone: "+41 31 987 65 43",
    rating: 4.5,
    verified: true,
    service_areas: ["Bern", "Luzern"],
    price_level: "CHF CHF CHF",
  },
  {
    id: "3",
    name: "QuickMove Express",
    logo: "⚡",
    email: "hello@quickmove.ch",
    phone: "+41 61 555 44 33",
    rating: 4.2,
    verified: false,
    service_areas: ["Basel", "Zürich"],
    price_level: "CHF",
  },
];

const CompaniesAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companies] = useState(mockCompanies);

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Firmen verwalten</h1>
                <p className="text-muted-foreground">
                  Firmen hinzufügen, bearbeiten und verwalten
                </p>
              </div>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Neue Firma hinzufügen
              </Button>
            </div>

            {/* Search & Filter */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Firma suchen (Name, E-Mail)..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Companies Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Alle Firmen ({filteredCompanies.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Firma</TableHead>
                        <TableHead>Kontakt</TableHead>
                        <TableHead>Bewertung</TableHead>
                        <TableHead>Servicegebiete</TableHead>
                        <TableHead>Preisniveau</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Keine Firmen gefunden
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCompanies.map((company) => (
                          <TableRow key={company.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-xl">
                                  {company.logo}
                                </div>
                                <div>
                                  <div className="font-medium">{company.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    ID: {company.id}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{company.email}</div>
                                <div className="text-muted-foreground">{company.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-accent text-accent" />
                                <span className="font-medium">{company.rating}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {company.service_areas.slice(0, 2).map((area) => (
                                  <Badge key={area} variant="secondary" className="text-xs">
                                    {area}
                                  </Badge>
                                ))}
                                {company.service_areas.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{company.service_areas.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-medium">{company.price_level}</span>
                            </TableCell>
                            <TableCell>
                              {company.verified ? (
                                <Badge variant="default" className="bg-success">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Geprüft
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Ungeprüft</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Back to Dashboard */}
            <div className="mt-6">
              <Link to="/admin">
                <Button variant="outline">Zurück zum Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CompaniesAdmin;
