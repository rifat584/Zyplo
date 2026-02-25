"use client";

/*
  EmptyState props:
    - className
    - children
*/
export default function EmptyState({ className = "", children }) {
  return <p className={className}>{children}</p>;
}
