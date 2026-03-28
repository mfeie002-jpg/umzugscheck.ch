import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, Download, Upload, Check, AlertCircle, 
  Clock, ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  description: string;
  category: string;
  required: boolean;
  completed: boolean;
  dueDate?: string;
  link?: string;
}

const documentsList: Document[] = [
  { id: "1", name: "Kündigungsschreiben alte Wohnung", description: "Fristgerecht kündigen, mind. 3 Monate vorher", category: "Wohnung", required: true, completed: false, dueDate: "3 Monate vorher" },
  { id: "2", name: "Mietvertrag neue Wohnung", description: "Unterschriebenen Vertrag sichern", category: "Wohnung", required: true, completed: false },
  { id: "3", name: "Wohnungsübergabeprotokoll", description: "Zustand dokumentieren", category: "Wohnung", required: true, completed: false, dueDate: "Übergabetag" },
  { id: "4", name: "Adressänderung Post", description: "Nachsendeauftrag einrichten", category: "Ummeldung", required: true, completed: false, link: "https://www.post.ch/de/privat/briefe-versenden/sendungen-nachsenden" },
  { id: "5", name: "Einwohnerkontrolle", description: "An- und Abmeldung", category: "Ummeldung", required: true, completed: false, dueDate: "14 Tage nach Umzug" },
  { id: "6", name: "Strassenverkehrsamt", description: "Fahrzeugummeldung", category: "Ummeldung", required: false, completed: false, dueDate: "14 Tage nach Umzug" },
  { id: "7", name: "Krankenkasse informieren", description: "Neue Adresse mitteilen", category: "Versicherungen", required: true, completed: false },
  { id: "8", name: "Hausratversicherung", description: "Adresse und Deckung anpassen", category: "Versicherungen", required: true, completed: false },
  { id: "9", name: "Strom anmelden", description: "Beim lokalen Anbieter", category: "Versorger", required: true, completed: false, dueDate: "2 Wochen vorher" },
  { id: "10", name: "Internet/TV ummelden", description: "Provider kontaktieren", category: "Versorger", required: true, completed: false, dueDate: "2 Wochen vorher" },
  { id: "11", name: "Bank informieren", description: "Adressänderung mitteilen", category: "Finanzen", required: true, completed: false },
  { id: "12", name: "Arbeitgeber informieren", description: "HR-Abteilung kontaktieren", category: "Arbeit", required: true, completed: false },
];

export const DocumentChecklist = () => {
  const [documents, setDocuments] = useState<Document[]>(documentsList);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Wohnung", "Ummeldung"]);

  const toggleDocument = (id: string) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, completed: !doc.completed } : doc
    ));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categories = [...new Set(documents.map(d => d.category))];
  const completedCount = documents.filter(d => d.completed).length;
  const requiredCompleted = documents.filter(d => d.required && d.completed).length;
  const requiredTotal = documents.filter(d => d.required).length;
  const progress = Math.round((completedCount / documents.length) * 100);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Dokumente Checkliste
          </CardTitle>
          <Badge variant={progress === 100 ? "default" : "secondary"}>
            {completedCount}/{documents.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Fortschritt</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            <span>Pflichtdokumente: {requiredCompleted}/{requiredTotal} erledigt</span>
          </div>
        </div>

        {/* Document List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {categories.map(category => {
              const categoryDocs = documents.filter(d => d.category === category);
              const categoryCompleted = categoryDocs.filter(d => d.completed).length;
              const isExpanded = expandedCategories.includes(category);

              return (
                <div key={category} className="border border-border/50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{category}</span>
                      <Badge variant="outline" className="text-xs">
                        {categoryCompleted}/{categoryDocs.length}
                      </Badge>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-2 space-y-2">
                      {categoryDocs.map(doc => (
                        <div
                          key={doc.id}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                            doc.completed ? 'bg-green-50 dark:bg-green-950/30' : 'hover:bg-muted/50'
                          }`}
                        >
                          <Checkbox
                            checked={doc.completed}
                            onCheckedChange={() => toggleDocument(doc.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium text-sm ${
                                doc.completed ? 'line-through text-muted-foreground' : ''
                              }`}>
                                {doc.name}
                              </span>
                              {doc.required && (
                                <Badge variant="destructive" className="text-xs">
                                  Pflicht
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {doc.description}
                            </p>
                            {doc.dueDate && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-amber-600">
                                <Clock className="h-3 w-3" />
                                {doc.dueDate}
                              </div>
                            )}
                          </div>
                          {doc.link && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => window.open(doc.link, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="gap-2 flex-1">
            <Download className="h-4 w-4" />
            Als PDF exportieren
          </Button>
          <Button variant="outline" size="sm" className="gap-2 flex-1">
            <Upload className="h-4 w-4" />
            Dokument hochladen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentChecklist;
