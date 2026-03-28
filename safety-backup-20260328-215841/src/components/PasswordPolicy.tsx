import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X, AlertCircle, Shield } from "lucide-react";

interface PasswordPolicyProps {
  password: string;
  onStrengthChange?: (strength: number) => void;
}

interface PolicyRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
  weight: number;
}

export default function PasswordPolicy({ password, onStrengthChange }: PasswordPolicyProps) {
  const rules: PolicyRule[] = useMemo(
    () => [
      {
        id: "length",
        label: "Mindestens 8 Zeichen",
        test: (p) => p.length >= 8,
        weight: 20,
      },
      {
        id: "uppercase",
        label: "Mindestens ein Grossbuchstabe (A-Z)",
        test: (p) => /[A-Z]/.test(p),
        weight: 20,
      },
      {
        id: "lowercase",
        label: "Mindestens ein Kleinbuchstabe (a-z)",
        test: (p) => /[a-z]/.test(p),
        weight: 20,
      },
      {
        id: "number",
        label: "Mindestens eine Zahl (0-9)",
        test: (p) => /[0-9]/.test(p),
        weight: 20,
      },
      {
        id: "special",
        label: "Mindestens ein Sonderzeichen (!@#$%...)",
        test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
        weight: 20,
      },
    ],
    []
  );

  const [results, setResults] = useState<Record<string, boolean>>({});
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const newResults: Record<string, boolean> = {};
    let totalStrength = 0;

    rules.forEach((rule) => {
      const passed = rule.test(password);
      newResults[rule.id] = passed;
      if (passed) {
        totalStrength += rule.weight;
      }
    });

    // Bonus for length
    if (password.length >= 12) totalStrength = Math.min(100, totalStrength + 10);
    if (password.length >= 16) totalStrength = Math.min(100, totalStrength + 10);

    setResults(newResults);
    setStrength(totalStrength);
    onStrengthChange?.(totalStrength);
  }, [password, rules, onStrengthChange]);

  const getStrengthLabel = (score: number) => {
    if (score >= 90) return { label: "Sehr stark", color: "text-green-600" };
    if (score >= 70) return { label: "Stark", color: "text-green-500" };
    if (score >= 50) return { label: "Mittel", color: "text-yellow-500" };
    if (score >= 30) return { label: "Schwach", color: "text-orange-500" };
    return { label: "Sehr schwach", color: "text-red-500" };
  };

  const getProgressColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  const { label, color } = getStrengthLabel(strength);

  if (!password) {
    return (
      <Card className="p-4 bg-muted/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Geben Sie ein Passwort ein, um die Stärke zu prüfen</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Strength Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Passwortstärke</span>
            <span className={`font-medium ${color}`}>{label}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getProgressColor(strength)}`}
              style={{ width: `${strength}%` }}
            />
          </div>
        </div>

        {/* Requirements List */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Anforderungen:</p>
          <ul className="space-y-1.5">
            {rules.map((rule) => {
              const passed = results[rule.id];
              return (
                <li
                  key={rule.id}
                  className={`flex items-center gap-2 text-sm ${
                    passed ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                  }`}
                >
                  {passed ? (
                    <Check className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <X className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span>{rule.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Tips */}
        {strength < 70 && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              Tipp: Verwenden Sie eine Kombination aus Buchstaben, Zahlen und Sonderzeichen.
              Längere Passwörter sind sicherer.
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
