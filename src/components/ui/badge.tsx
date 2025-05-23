import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { buttonInteractions } from '@/lib/interactions';

const badgeVariants = cva(
  `inline-flex items-center justify-center rounded-lg border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${buttonInteractions.base} overflow-hidden shadow-sm hover:shadow-md`,
  {
    variants: {
      variant: {
        default: `border-transparent bg-primary text-primary-foreground [a&]:${buttonInteractions.hover.primary} ${buttonInteractions.active.scale}`,
        secondary: `border-transparent bg-secondary text-secondary-foreground [a&]:${buttonInteractions.hover.secondary} ${buttonInteractions.active.scale}`,
        destructive: `border-transparent bg-destructive text-destructive-foreground [a&]:${buttonInteractions.hover.destructive} focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 ${buttonInteractions.active.scale}`,
        outline: `text-foreground [a&]:${buttonInteractions.hover.outline} ${buttonInteractions.active.scale}`,
        success: `border-transparent bg-success text-success-foreground [a&]:${buttonInteractions.hover.success} ${buttonInteractions.active.scale}`,
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
