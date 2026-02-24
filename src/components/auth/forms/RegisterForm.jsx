"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import PasswordField from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    acceptTerms: z.boolean().refine((value) => value, {
      message: "You must accept the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const router = useRouter();

  const onSubmit = async (data) => {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message);
      return;
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-slate-700 dark:text-slate-200">
          Full name
        </Label>
        <Input id="name" placeholder="Alex Morgan" {...register("name")} />
        {errors.name ? (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        ) : null}
      </div>

      <PasswordField
        id="password"
        label="Password"
        placeholder="Create a password"
        registration={register("password")}
        error={errors.password?.message}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        placeholder="Repeat password"
        registration={register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <div className="space-y-1">
        <Label
          htmlFor="acceptTerms"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300"
        >
          <Checkbox id="acceptTerms" {...register("acceptTerms")} />I agree to
          the terms and privacy policy
        </Label>
        {errors.acceptTerms ? (
          <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
export { registerSchema };
