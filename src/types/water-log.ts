export interface WaterLog {
  id: string
  user_id: string
  amount_ml: number
  logged_at: string
  created_at: string
}

export interface WaterLogInput {
  amount_ml: number
  logged_at?: string
}
