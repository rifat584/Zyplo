"use client";

/*
  PageHeader props:
    - className
    - children
*/
export default function PageHeader({ className = "", children }) {
  return <div className={className}>{children}</div>;
}
