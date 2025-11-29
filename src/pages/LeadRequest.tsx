import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Loader2, Send, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().min(10, "Telefonnummer muss mindestens 10 Zeichen lang sein"),
  message: z.string().optional(),
});

interface Company {
  id: string;
  name: string;
  logo: string | null;
}

export default function LeadRequest() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  useEffect(() => {
    if (id) {
      fetchSelectedCompanies();
    }
  }, [id]);

  const fetchSelectedCompanies = async () => {
    try {
      setLoading(true);
      const companyIds = searchParams.get('companies')?.split(',') || [];
      
      if (companyIds.length === 0) {
        toast.error('Keine Firmen ausgewählt');
        navigate(`/ergebnis/${id}`);
        return;
      }

      const { data, error } = await supabase
        .from('companies')
        .select('id, name, logo')
        .in('id', companyIds);

      if (error) throw error;

      setCompanies(data || []);
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      toast.error('Fehler beim Laden der Firmen');
      navigate(`/ergebnis/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true);
      
      const companyIds = searchParams.get('companies')?.split(',') || [];
      
      const { data, error } = await supabase.functions.invoke('create-funnel-lead', {
        body: {
          estimateSessionId: id,
          selectedCompanyIds: companyIds,
          contact: {
            name: values.name,
            email: values.email,
            phone: values.phone,
          },
          message: values.message,
        },
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        toast.success('Ihre Anfrage wurde erfolgreich versendet!');
        navigate(`/danke/${data.data.id}`);
      } else {
        throw new Error(data?.error?.message || 'Fehler beim Versenden der Anfrage');
      }
    } catch (error: any) {
      console.error('Error submitting lead:', error);
      toast.error(error.message || 'Fehler beim Versenden der Anfrage');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Offerte anfordern
            </h1>
            <p className="text-muted-foreground">
              Füllen Sie das Formular aus und erhalten Sie unverbindliche Angebote
            </p>
          </div>

          {/* Selected Companies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Ausgewählte Firmen ({companies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {companies.map((company) => (
                  <div key={company.id} className="flex items-center gap-2 p-2 border rounded-lg">
                    {company.logo && (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-10 h-10 object-contain rounded"
                      />
                    )}
                    <span className="text-sm font-medium">{company.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Ihre Kontaktdaten</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Max Mustermann" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="max@beispiel.ch" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+41 79 123 45 67" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nachricht (optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Zusätzliche Informationen zu Ihrem Umzug..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Offerte anfordern
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Ihre Daten werden vertraulich behandelt und nur an die ausgewählten Firmen weitergeleitet.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
