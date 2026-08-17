export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  reviewText: string;
  verifiedPurchase: boolean;
  createdAt: string;
}