export type MBTIColorKey = 'purple' | 'green' | 'blue' | 'yellow'

export const MBTI_COLORS: Record<MBTIColorKey, { primary: string; secondary: string; shadow: string }> = {
  purple: {
    primary: '#9333ea',
    secondary: '#c084fc',
    shadow: '#a855f7',
  },
  green: {
    primary: '#10b981',
    secondary: '#34d399',
    shadow: '#22c55e',
  },
  blue: {
    primary: '#3b82f6',
    secondary: '#60a5fa',
    shadow: '#2563eb',
  },
  yellow: {
    primary: '#f59e0b',
    secondary: '#fbbf24',
    shadow: '#eab308',
  },
}

export function getColorByDimension(dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'): MBTIColorKey {
  switch (dimension) {
    case 'E':
    case 'I':
      return 'purple'
    case 'S':
    case 'N':
      return 'green'
    case 'T':
    case 'F':
      return 'blue'
    case 'J':
    case 'P':
      return 'yellow'
    default:
      return 'purple'
  }
}

export function getAllMBTIColors(): MBTIColorKey[] {
  return ['purple', 'green', 'blue', 'yellow']
}
