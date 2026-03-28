import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Home } from 'lucide-react';
import { useFlowNavigation } from '@/hooks/useFlowNavigation';

interface FlowErrorDisplayProps {
  title?: string;
  description?: string;
  errorType?: '404' | '500' | 'generic';
}

export function FlowErrorDisplay({
  title = "Seite nicht gefunden",
  description = "Die angeforderte Seite existiert leider nicht. Bist du im Umzugs-Prozess falsch abgebogen?",
  errorType = '404'
}: FlowErrorDisplayProps) {
  const { isFlow, currentStep, totalSteps, goBack, restartFlow, goHome } = useFlowNavigation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-destructive">
          <span className="text-8xl font-black">{errorType === '500' ? '500' : '404'}</span>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-muted-foreground text-lg">{description}</p>

        {isFlow ? (
          <div className="p-4 mt-6 bg-muted rounded-xl border border-border">
            <p className="text-sm font-medium mb-2">
              Du warst auf Schritt {currentStep} von {totalSteps} in deinem Umzugs-Prozess.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Button onClick={goBack} variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zum Schritt
              </Button>
              <Button onClick={restartFlow} className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Flow neu starten
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex justify-center">
            <Button onClick={goHome} size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-5 w-5" />
              Zurück zur Startseite
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}