import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReviewSubmissionForm } from "@/components/reviews/ReviewSubmissionForm";

export default function ReviewSubmission() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewRequest = async () => {
      if (!requestId) {
        setLoading(false);
        return;
      }

      try {
        const { data: reviewRequest } = await supabase
          .from('review_requests')
          .select('provider_id')
          .eq('id', requestId)
          .single();

        if (reviewRequest) {
          const { data: company } = await supabase
            .from('companies')
            .select('id, name')
            .eq('id', reviewRequest.provider_id)
            .single();

          if (company) {
            setCompanyInfo({ id: company.id, name: company.name });
          }
        }
      } catch (error) {
        console.error('Error fetching review request:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewRequest();
  }, [requestId]);

  const handleSuccess = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Vielen Dank!</h2>
              <p className="text-muted-foreground">
                Ihre Bewertung wurde erfolgreich übermittelt.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gradient-light py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {companyInfo ? (
            <ReviewSubmissionForm
              companyId={companyInfo.id}
              companyName={companyInfo.name}
              onSuccess={handleSuccess}
            />
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Firma nicht gefunden</h2>
                <p className="text-muted-foreground">
                  Diese Bewertungsanfrage ist ungültig oder abgelaufen.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
