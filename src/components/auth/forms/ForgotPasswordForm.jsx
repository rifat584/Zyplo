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
        <Label htmlFor="email" className="text-foreground">
          Email
        </Label>
        <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
        {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
      </div>

      <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
        {isSubmitting ? "Sending reset link..." : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="cursor-pointer text-secondary transition-colors hover:text-secondary dark:text-secondary dark:hover:text-secondary">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

export default ForgotPasswordForm;
export { forgotPasswordSchema };
