"use client";

/*
  StatPill props:
    - className
    - children
*/
export default function StatPill({ className = "", children }) {
  return <span className={className}>{children}</span>;
}
