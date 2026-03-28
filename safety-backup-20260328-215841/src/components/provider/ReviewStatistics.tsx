import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, TrendingDown, MessageSquare, ThumbsUp, Clock, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ReviewWithResponse } from "@/components/reviews/ReviewWithResponse";

interface ReviewWithProfile {
  id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string | null;
  };
}

interface ReviewResponse {
  id: string;
  review_id: string;
  response: string;
  created_at: string;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  recentReviews: ReviewWithProfile[];
  reviewResponses: { [key: string]: ReviewResponse };
  trend: 'up' | 'down' | 'stable';
  responseRate: number;
  avgResponseTime: number;
}

interface ReviewStatisticsProps {
  providerId: string;
  companyId?: string;
}

export const ReviewStatistics = ({ providerId, companyId }: ReviewStatisticsProps) => {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviewStats();
  }, [providerId, companyId]);

  const fetchReviewStats = async () => {
    try {
      // Fetch reviews for this company/provider with profiles
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            full_name
          )
        `)
        .eq('company_id', companyId || providerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch all responses for these reviews
      const reviewIds = reviews?.map(r => r.id) || [];
      const { data: responses } = await supabase
        .from('review_responses')
        .select('*')
        .in('review_id', reviewIds);

      // Map responses by review_id
      const reviewResponses: { [key: string]: ReviewResponse } = {};
      responses?.forEach(r => {
        reviewResponses[r.review_id] = r;
      });

      // Calculate statistics
      const totalReviews = reviews?.length || 0;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews 
        : 0;

      // Rating distribution
      const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews?.forEach(r => {
        const rating = Math.round(r.rating || 0);
        if (rating >= 1 && rating <= 5) {
          ratingDistribution[rating]++;
        }
      });

      // Recent reviews (last 10 for response management)
      const recentReviews: ReviewWithProfile[] = reviews?.slice(0, 10).map(r => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        created_at: r.created_at,
        user_id: r.user_id,
        profiles: r.profiles as { full_name: string | null } | undefined
      })) || [];

      // Calculate trend (compare last month to previous month)
      const now = new Date();
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
      const previousMonth = new Date(now.setMonth(now.getMonth() - 1));
      
      const lastMonthReviews = reviews?.filter(r => new Date(r.created_at) > lastMonth) || [];
      const previousMonthReviews = reviews?.filter(r => {
        const date = new Date(r.created_at);
        return date > previousMonth && date <= lastMonth;
      }) || [];

      const lastMonthAvg = lastMonthReviews.length > 0 
        ? lastMonthReviews.reduce((sum, r) => sum + r.rating, 0) / lastMonthReviews.length 
        : 0;
      const previousMonthAvg = previousMonthReviews.length > 0 
        ? previousMonthReviews.reduce((sum, r) => sum + r.rating, 0) / previousMonthReviews.length 
        : 0;

      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (lastMonthAvg > previousMonthAvg + 0.2) trend = 'up';
      else if (lastMonthAvg < previousMonthAvg - 0.2) trend = 'down';

      const responseRate = totalReviews > 0 
        ? (Object.keys(reviewResponses).length / totalReviews) * 100 
        : 0;

      setStats({
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        recentReviews,
        reviewResponses,
        trend,
        responseRate: Math.round(responseRate),
        avgResponseTime: 24 // Placeholder - would calculate from actual response times
      });
    } catch (error) {
      console.error('Error fetching review stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Keine Bewertungsdaten verfügbar
        </CardContent>
      </Card>
    );
  }

  const maxRatingCount = Math.max(...Object.values(stats.ratingDistribution), 1);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">{stats.averageRating}</span>
            </div>
            <p className="text-xs text-muted-foreground">Durchschnitt</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              {stats.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
              {stats.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
              <span className={`text-xs ${stats.trend === 'up' ? 'text-green-500' : stats.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                {stats.trend === 'up' ? 'Steigend' : stats.trend === 'down' ? 'Fallend' : 'Stabil'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.totalReviews}</span>
            </div>
            <p className="text-xs text-muted-foreground">Bewertungen</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <ThumbsUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.responseRate}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Antwortrate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.avgResponseTime}h</span>
            </div>
            <p className="text-xs text-muted-foreground">Ø Antwortzeit</p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            Bewertungsverteilung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = stats.ratingDistribution[rating] || 0;
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <Progress value={percentage} className="h-2" />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {count} ({Math.round(percentage)}%)
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Reviews with Response Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bewertungen verwalten</CardTitle>
          <CardDescription>Antworten Sie auf Kundenbewertungen</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentReviews.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Noch keine Bewertungen vorhanden
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recentReviews.map(review => (
                <ReviewWithResponse
                  key={review.id}
                  review={review}
                  companyId={companyId || providerId}
                  existingResponse={stats.reviewResponses[review.id]}
                  canRespond={true}
                  onResponseUpdated={fetchReviewStats}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
