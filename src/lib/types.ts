export type Video = {
  id: string
  title: string
  description: string
  thumbnail_url: string
  bunny_video_id: string
  price_cents: number
  category: string
  age_group: string
  printable_url: string
  created_at: string
}

export type Purchase = {
  id: string
  user_id: string
  video_id: string
  stripe_payment_id: string
  amount_paid: number
  created_at: string
}