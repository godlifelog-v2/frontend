import React, { memo, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Avatar } from "@/shared/components/ui/avatar";

const ReviewSection = memo(({ reviews = [], handleSubmitReview, isSubmittingReview = false, formatReviewDate }) => {
  const [localReview, setLocalReview] = useState("");

  const reviewsArray = Array.isArray(reviews)
    ? reviews
    : typeof reviews === "string" && reviews.trim() !== ""
    ? [reviews]
    : [];
  const hasReviews = reviewsArray.length > 0;

  const handleSubmit = () => {
    if (localReview.trim() && handleSubmitReview) {
      handleSubmitReview(localReview);
      setLocalReview("");
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold">루틴 리뷰</h2>
        <span className="text-sm text-gray-500 ml-2">{reviewsArray.length}개</span>
      </div>

      {!hasReviews && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 bg-blue-100">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=current" alt="프로필" />
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="이 루틴에 대한 경험을 공유해보세요..."
                  className="resize-none mb-2"
                  value={localReview}
                  onChange={(e) => setLocalReview(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSubmit} disabled={isSubmittingReview || !localReview?.trim()} className="flex items-center gap-1">
                    <Send className="w-4 h-4" />
                    리뷰 등록
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {hasReviews ? (
        <div className="space-y-4">
          {reviewsArray.map((review, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10 bg-blue-100">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`} alt="사용자" />
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-semibold">사용자</span>
                    <span className="text-xs text-gray-500">{formatReviewDate(review.createdAt || new Date().toISOString())}</span>
                  </div>
                  <p className="mt-2 text-gray-700">{typeof review === "string" ? review : review.content || review.review || ""}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">아직 리뷰가 없습니다. 리뷰를 작성해보세요!</div>
      )}
    </div>
  );
});

export default ReviewSection;
