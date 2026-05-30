import type { HabitCardModel } from '../../composables/useHabits'
import type { HabitIconKey, HabitTone } from '../../types/habit'

export interface HabitFormState {
  name: string
  description: string
  tone: HabitTone
  icon_key: HabitIconKey
}

export type HabitCardViewModel = HabitCardModel
