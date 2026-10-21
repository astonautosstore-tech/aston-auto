import React, { forwardRef } from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { children, className = "", as: Component = "section", ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={`relative w-full py-20 md:py-28 lg:py-36 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Section;
