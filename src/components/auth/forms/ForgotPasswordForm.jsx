"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (email) => {
    console.log(email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">
          Email
        </Label>
        <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
        {errors.email ? <p className="text-xs text-red-500">{errors.email.message}</p> : null}
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
        {isSubmitting ? "Sending reset link..." : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        Remember your password?{" "}
        <Link href="/login" className="cursor-pointer text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

export default ForgotPasswordForm;
export { forgotPasswordSchema };
