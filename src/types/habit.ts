export type HabitTone = 'sage' | 'amber' | 'sky' | 'rose' | 'plum'

export type HabitIconKey = 'spark' | 'leaf' | 'book' | 'sun' | 'heart'

export interface Habit {
  id: string
  user_id: string
  name: string
  description: string | null
  tone: HabitTone
  icon_key: HabitIconKey
  created_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  user_id: string
  completed_on: string
  created_at: string
}

export interface HabitInput {
  name: string
  description?: string | null
  tone: HabitTone
  icon_key: HabitIconKey
}

export interface HabitSnapshot {
  habits: Habit[]
  completions: HabitCompletion[]
}
