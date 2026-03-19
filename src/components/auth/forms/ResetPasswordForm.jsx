"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import PasswordField from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/button";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
      <PasswordField
        id="password"
        label="New password"
        placeholder="Enter a new password"
        registration={register("password")}
        error={errors.password?.message}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        placeholder="Repeat your new password"
        registration={register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
        {isSubmitting ? "Resetting password..." : "Reset password"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Return to{" "}
        <Link href="/login" className="cursor-pointer text-secondary transition-colors hover:text-secondary dark:text-secondary dark:hover:text-secondary">
          sign in
        </Link>
      </p>
    </form>
  );
}

export default ResetPasswordForm;
export { resetPasswordSchema };
