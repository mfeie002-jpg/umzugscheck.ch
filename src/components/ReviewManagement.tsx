import { useState } from "react";
import { Star, ThumbsUp, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  bookingId: string;
  response?: string;
  helpful: number;
}

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      customerName: "Anna Meier",
      rating: 5,
      comment: "Hervorragender Service! Das Team war pünktlich, professionell und sehr sorgfältig mit unseren Möbeln. Absolut empfehlenswert!",
      date: "2024-01-15",
      status: "approved",
      bookingId: "FEU-2024-001",
      helpful: 12
    },
    {
      id: "2",
      customerName: "Thomas Schmidt",
      rating: 5,
      comment: "Perfekte Organisation vom Anfang bis zum Ende. Die Preise sind fair und transparent. Würde jederzeit wieder buchen!",
      date: "2024-01-14",
      status: "approved",
      bookingId: "FEU-2024-002",
      response: "Vielen Dank für Ihr positives Feedback! Es freut uns sehr, dass wir Ihre Erwartungen erfüllen konnten.",
      helpful: 8
    },
    {
      id: "3",
      customerName: "Maria Rossi",
      rating: 4,
      comment: "Guter Service, das Team war freundlich. Kleinere Verzögerung beim Start, aber ansonsten alles bestens.",
      date: "2024-01-13",
      status: "pending",
      bookingId: "FEU-2024-003",
      helpful: 3
    }
  ]);

  const [responseText, setResponseText] = useState<Record<string, string>>({});

  const handleApprove = (reviewId: string) => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, status: "approved" as const } : r
    ));
  };

  const handleReject = (reviewId: string) => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, status: "rejected" as const } : r
    ));
  };

  const handleResponse = (reviewId: string) => {
    const response = responseText[reviewId];
    if (response) {
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, response, status: "approved" as const } : r
      ));
      setResponseText({ ...responseText, [reviewId]: "" });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Genehmigt</Badge>;
      case "rejected":
        return <Badge variant="destructive">Abgelehnt</Badge>;
      case "pending":
        return <Badge variant="outline">Ausstehend</Badge>;
      default:
        return null;
    }
  };

  const filterReviews = (status?: string) => {
    if (!status) return reviews;
    return reviews.filter(r => r.status === status);
  };

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{avgRating}</div>
          <div className="text-sm text-muted-foreground">Durchschnitt</div>
          <div className="mt-1">{renderStars(Math.round(parseFloat(avgRating)))}</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{reviews.length}</div>
          <div className="text-sm text-muted-foreground">Gesamt</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {filterReviews("pending").length}
          </div>
          <div className="text-sm text-muted-foreground">Ausstehend</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {filterReviews("approved").length}
          </div>
          <div className="text-sm text-muted-foreground">Genehmigt</div>
        </Card>
      </div>

      {/* Reviews List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Alle ({reviews.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Ausstehend ({filterReviews("pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Genehmigt ({filterReviews("approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Abgelehnt ({filterReviews("rejected").length})
          </TabsTrigger>
        </TabsList>

        {["all", "pending", "approved", "rejected"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
            {filterReviews(tab === "all" ? undefined : tab).map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{review.customerName}</h3>
                      {getStatusBadge(review.status)}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                      {renderStars(review.rating)}
                      <span>•</span>
                      <span>{review.date}</span>
                      <span>•</span>
                      <span>Buchung: {review.bookingId}</span>
                    </div>
                    <p className="text-sm mb-3">{review.comment}</p>
                    
                    {review.response && (
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Ihre Antwort:</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.response}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.helpful} fanden dies hilfreich</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {review.status === "pending" && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(review.id)}
                        className="gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Genehmigen
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(review.id)}
                        className="gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Ablehnen
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Textarea
                        placeholder="Antwort auf diese Bewertung schreiben..."
                        value={responseText[review.id] || ""}
                        onChange={(e) =>
                          setResponseText({ ...responseText, [review.id]: e.target.value })
                        }
                        rows={3}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleResponse(review.id)}
                        disabled={!responseText[review.id]}
                      >
                        Antworten & Genehmigen
                      </Button>
                    </div>
                  </div>
                )}

                {review.status === "approved" && !review.response && (
                  <div className="space-y-2 pt-4 border-t">
                    <Textarea
                      placeholder="Antwort auf diese Bewertung schreiben..."
                      value={responseText[review.id] || ""}
                      onChange={(e) =>
                        setResponseText({ ...responseText, [review.id]: e.target.value })
                      }
                      rows={3}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleResponse(review.id)}
                      disabled={!responseText[review.id]}
                    >
                      Antworten
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ReviewManagement;
