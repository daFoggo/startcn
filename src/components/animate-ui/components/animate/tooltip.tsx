import * as motion from 'motion/react-client'
import * as React from 'react'

import {
  TooltipArrow as TooltipArrowPrimitive,
  TooltipContent as TooltipContentPrimitive,
  Tooltip as TooltipPrimitive,
  TooltipProvider as TooltipProviderPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
  type TooltipContentProps as TooltipContentPrimitiveProps,
  type TooltipProps as TooltipPrimitiveProps,
  type TooltipProviderProps as TooltipProviderPrimitiveProps,
  type TooltipTriggerProps as TooltipTriggerPrimitiveProps,
} from '@/components/animate-ui/primitives/animate/tooltip'
import { cn } from '@/lib/utils'
type TooltipProviderProps = TooltipProviderPrimitiveProps

function TooltipProvider({ openDelay = 0, ...props }: TooltipProviderProps) {
  return <TooltipProviderPrimitive openDelay={openDelay} {...props} />
}

type TooltipProps = TooltipPrimitiveProps

function Tooltip({ sideOffset = 10, ...props }: TooltipProps) {
  return <TooltipPrimitive sideOffset={sideOffset} {...props} />
}

type TooltipTriggerProps = TooltipTriggerPrimitiveProps

function TooltipTrigger({ ...props }: TooltipTriggerProps) {
  return <TooltipTriggerPrimitive {...props} />
}

type TooltipContentProps = Omit<TooltipContentPrimitiveProps, 'asChild'> & {
  children: React.ReactNode
  layout?: boolean | 'position' | 'size' | 'preserve-aspect'
}

function TooltipContent({
  className,
  children,
  layout = 'preserve-aspect',
  ...props
}: TooltipContentProps) {
  return (
    <TooltipContentPrimitive
      className={cn(
        'z-50 w-fit bg-primary text-primary-foreground rounded-md',
        className,
      )}
      {...props}
    >
      <motion.div className="overflow-hidden px-3 py-1.5 text-xs text-balance">
        <motion.div layout={layout}>{children}</motion.div>
      </motion.div>
      <TooltipArrowPrimitive
        className="fill-primary size-3 data-[side='bottom']:translate-y-px data-[side='right']:translate-x-px data-[side='left']:-translate-x-px data-[side='top']:-translate-y-px"
        tipRadius={2}
      />
    </TooltipContentPrimitive>
  )
}

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TooltipContentProps,
  type TooltipProps,
  type TooltipProviderProps,
  type TooltipTriggerProps,
}
