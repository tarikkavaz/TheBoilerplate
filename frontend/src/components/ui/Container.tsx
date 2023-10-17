import React from 'react'
import clsx from 'clsx'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: string
  size?: 'default' | 'md' | 'lg' | 'fluid'
  children: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({
  as = 'div',
  size = 'default',
  children,
  className,
  ...others
}: ContainerProps) => {
  const sizes = {
    md: 'max-w-screen-md mx-auto px-4',
    lg: 'max-w-screen-lg mx-auto px-4',
    default: 'max-w-screen-xl mx-auto px-4',
    fluid: 'w-full mx-auto px-4',
  }
  return React.createElement(
    as,
    { className: clsx(sizes[size], className), ...others },
    children
  )
}
export default Container
