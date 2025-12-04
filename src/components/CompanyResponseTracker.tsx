import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, MessageSquare, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

interface CompanyResponse {
  companyId: string;
  companyName: string;
  status: 'pending' | 'responded' | 'expired' | 'declined';
  responseTime?: number;
  message?: string;
  quotedPrice?: number;
  sentAt: Date;
  respondedAt?: Date;
}

export const CompanyResponseTracker = () => {
  const [responses, setResponses] = useState<CompanyResponse[]>([
    {
      companyId: "1",
      companyName: "Zürich Umzüge AG",
      status: 'responded',
      responseTime: 2,
      message: "Gerne erstellen wir Ihnen ein Angebot...",
      quotedPrice: 1250,
      sentAt: new Date(Date.now() - 3600000 * 3),
      respondedAt: new Date(Date.now() - 3600000)
    },
    {
      companyId: "2",
      companyName: "Express Moving GmbH",
      status: 'pending',
      sentAt: new Date(Date.now() - 3600000 * 2)
    },
    {
      companyId: "3",
      companyName: "Swiss Relocation",
      status: 'responded',
      responseTime: 4,
      message: "Vielen Dank für Ihre Anfrage...",
      quotedPrice: 1450,
      sentAt: new Date(Date.now() - 3600000 * 5),
      respondedAt: new Date(Date.now() - 3600000 * 1)
    },
    {
      companyId: "4",
      companyName: "Budget Umzug",
      status: 'expired',
      sentAt: new Date(Date.now() - 3600000 * 48)
    }
  ]);

  const getStatusIcon = (status: CompanyResponse['status']) => {
    switch (status) {
      case 'responded': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'expired': return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'declined': return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: CompanyResponse['status']) => {
    switch (status) {
      case 'responded': return <Badge className="bg-green-100 text-green-700">Antwort erhalten</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-700">Ausstehend</Badge>;
      case 'expired': return <Badge variant="secondary">Abgelaufen</Badge>;
      case 'declined': return <Badge className="bg-red-100 text-red-700">Abgelehnt</Badge>;
    }
  };

  const getTimeSince = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / 3600000);
    if (hours < 1) return "Vor wenigen Minuten";
    if (hours < 24) return `Vor ${hours} Stunde${hours > 1 ? 'n' : ''}`;
    const days = Math.floor(hours / 24);
    return `Vor ${days} Tag${days > 1 ? 'en' : ''}`;
  };

  const respondedCount = responses.filter(r => r.status === 'responded').length;
  const totalCount = responses.length;
  const responseRate = Math.round((respondedCount / totalCount) * 100);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Antworten verfolgen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Antwortrate</span>
            <span className="text-sm">{respondedCount} von {totalCount}</span>
          </div>
          <Progress value={responseRate} className="h-2" />
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {respondedCount} Antworten
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-yellow-500" />
              {responses.filter(r => r.status === 'pending').length} Ausstehend
            </div>
          </div>
        </div>

        {/* Response List */}
        <div className="space-y-3">
          {responses.map(response => (
            <div
              key={response.companyId}
              className={`p-4 rounded-lg border transition-colors ${
                response.status === 'responded' 
                  ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30'
                  : 'border-border/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(response.status)}
                  <span className="font-medium">{response.companyName}</span>
                </div>
                {getStatusBadge(response.status)}
              </div>

              {response.status === 'responded' && response.quotedPrice && (
                <div className="mb-2">
                  <span className="text-lg font-bold text-primary">
                    CHF {response.quotedPrice.toLocaleString()}
                  </span>
                  {response.message && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      "{response.message}"
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Gesendet: {getTimeSince(response.sentAt)}</span>
                {response.responseTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Antwort in {response.responseTime}h
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {responses.some(r => r.status === 'pending') && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg text-sm">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-700 dark:text-yellow-400">
              Noch {responses.filter(r => r.status === 'pending').length} Antworten ausstehend
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyResponseTracker;
