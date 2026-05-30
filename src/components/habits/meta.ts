import type { CSSProperties } from 'vue'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faBolt,
  faBookOpen,
  faHeart,
  faLeaf,
  faSun,
} from '@fortawesome/free-solid-svg-icons'

import type { HabitIconKey, HabitTone } from '../../types/habit'

export const HABIT_TONE_OPTIONS: Array<{ value: HabitTone; label: string }> = [
  { value: 'sage', label: 'Sage' },
  { value: 'amber', label: 'Amber' },
  { value: 'sky', label: 'Sky' },
  { value: 'rose', label: 'Rose' },
  { value: 'plum', label: 'Plum' },
]

export const HABIT_ICON_OPTIONS: Array<{ value: HabitIconKey; label: string }> = [
  { value: 'spark', label: 'Spark' },
  { value: 'leaf', label: 'Leaf' },
  { value: 'book', label: 'Book' },
  { value: 'sun', label: 'Sun' },
  { value: 'heart', label: 'Heart' },
]

export function getHabitIcon(iconKey: HabitIconKey): IconDefinition {
  switch (iconKey) {
    case 'leaf':
      return faLeaf
    case 'book':
      return faBookOpen
    case 'sun':
      return faSun
    case 'heart':
      return faHeart
    case 'spark':
    default:
      return faBolt
  }
}

export function getHabitToneStyles(tone: HabitTone): CSSProperties {
  switch (tone) {
    case 'amber':
      return {
        '--habit-accent': '#b26b2e',
        '--habit-accent-soft': 'rgba(226, 174, 106, 0.16)',
        '--habit-accent-strong': '#d08d43',
      } as CSSProperties
    case 'sky':
      return {
        '--habit-accent': '#317794',
        '--habit-accent-soft': 'rgba(109, 177, 201, 0.16)',
        '--habit-accent-strong': '#4c97b4',
      } as CSSProperties
    case 'rose':
      return {
        '--habit-accent': '#a55b67',
        '--habit-accent-soft': 'rgba(218, 162, 171, 0.16)',
        '--habit-accent-strong': '#c57c88',
      } as CSSProperties
    case 'plum':
      return {
        '--habit-accent': '#7f5c93',
        '--habit-accent-soft': 'rgba(177, 150, 199, 0.16)',
        '--habit-accent-strong': '#9d79b3',
      } as CSSProperties
    case 'sage':
    default:
      return {
        '--habit-accent': '#2f7e67',
        '--habit-accent-soft': 'rgba(94, 173, 145, 0.16)',
        '--habit-accent-strong': '#41a386',
      } as CSSProperties
  }
}
