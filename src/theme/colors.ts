import { sac9DarkTheme, sac9LightTheme } from '@/theme/sac9-theme'

/**
 * Paleta SAC9 — valores espelhados dos tokens CSS em `src/index.css`.
 */
export const sac9Palette = sac9LightTheme

export const sac9DarkPalette = sac9DarkTheme

export const cssVarNames = {
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  background: '--background',
  foreground: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  border: '--border',
  input: '--input',
  ring: '--ring',
  chart1: '--chart-1',
  chart2: '--chart-2',
  chart3: '--chart-3',
  chart4: '--chart-4',
  chart5: '--chart-5',
} as const

export const chartCssVars = [
  cssVarNames.chart1,
  cssVarNames.chart2,
  cssVarNames.chart3,
  cssVarNames.chart4,
  cssVarNames.chart5,
] as const

export function chartVar(index: number): string {
  return `var(${chartCssVars[index % chartCssVars.length]})`
}
