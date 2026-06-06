import { cn } from '@/lib/utils'

const sizeClasses = {
  sm: 'h-12 max-h-[60px] max-w-[160px]',
  md: 'h-14 max-h-[60px] max-w-[180px]',
  lg: 'h-20 max-h-[100px] max-w-[260px]',
  xl: 'h-24 max-h-[120px] max-w-[320px]',
} as const

type Sac9LogoProps = {
  size?: keyof typeof sizeClasses
  className?: string
}

export function Sac9Logo({ size = 'md', className }: Sac9LogoProps) {
  return (
    <img
      src="/sac9-logo.png"
      alt="SAC9"
      className={cn('block w-auto object-contain', sizeClasses[size], className)}
    />
  )
}
