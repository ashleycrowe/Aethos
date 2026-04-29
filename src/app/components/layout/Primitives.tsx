import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ATOMIC LAYOUT ENGINE v1.0
 * Standardized responsive primitives for Aethos Design System
 */

interface BaseProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * 1. Stack: Vertical or Horizontal layout with consistent gaps
 */
export const Stack = ({ 
  children, 
  className, 
  direction = 'col',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false
}: BaseProps & { 
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse',
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none',
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline',
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly',
  wrap?: boolean
}) => {
  const gapClasses = {
    xs: 'gap-[var(--space-fluid-xs)]',
    sm: 'gap-[var(--space-fluid-sm)]',
    md: 'gap-[var(--space-fluid-md)]',
    lg: 'gap-[var(--space-fluid-lg)]',
    xl: 'gap-[var(--space-fluid-xl)]',
    none: 'gap-0'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  };

  return (
    <div className={cn(
      'flex min-w-0', // Prevent flex blowout
      directionClasses[direction],
      gapClasses[gap],
      alignClasses[align],
      justifyClasses[justify],
      wrap && 'flex-wrap',
      className
    )}>
      {children}
    </div>
  );
};

/**
 * 2. Grid: Responsive grid system
 */
export const Grid = ({ 
  children, 
  className, 
  cols = 1,
  md = null,
  lg = null,
  xl = null,
  gap = 'md'
}: BaseProps & { 
  cols?: number,
  md?: number | null,
  lg?: number | null,
  xl?: number | null,
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'
}) => {
  const gapClasses = {
    xs: 'gap-[var(--space-fluid-xs)]',
    sm: 'gap-[var(--space-fluid-sm)]',
    md: 'gap-[var(--space-fluid-md)]',
    lg: 'gap-[var(--space-fluid-lg)]',
    xl: 'gap-[var(--space-fluid-xl)]',
    none: 'gap-0'
  };

  const colClasses = `grid-cols-${cols}`;
  const mdClasses = md ? `md:grid-cols-${md}` : '';
  const lgClasses = lg ? `lg:grid-cols-${lg}` : '';
  const xlClasses = xl ? `xl:grid-cols-${xl}` : '';

  return (
    <div className={cn(
      'grid w-full',
      colClasses,
      mdClasses,
      lgClasses,
      xlClasses,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

/**
 * 3. PageContainer: Standard padding and max-width for pages
 */
export const PageContainer = ({ children, className, fullWidth = false }: BaseProps & { fullWidth?: boolean }) => {
  return (
    <div className={cn(
      'w-full mx-auto px-[var(--space-fluid-sm)] md:px-[var(--space-fluid-md)] lg:px-[var(--space-fluid-lg)]',
      !fullWidth && 'max-w-8xl',
      className
    )}>
      {children}
    </div>
  );
};

/**
 * 4. Section: Standard vertical spacing between major page sections
 */
export const Section = ({ children, className, spacing = 'lg' }: BaseProps & { spacing?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const spacingClasses = {
    sm: 'py-[var(--space-fluid-sm)]',
    md: 'py-[var(--space-fluid-md)]',
    lg: 'py-[var(--space-fluid-lg)]',
    xl: 'py-[var(--space-fluid-xl)]'
  };

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  );
};
