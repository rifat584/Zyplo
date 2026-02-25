"use client";

/*
  Section props:
    - className
    - children
*/
export default function Section({ className = "", children }) {
  return <section className={className}>{children}</section>;
}
