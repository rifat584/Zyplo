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
import { useState, useEffect } from "react";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const [serverError, setServerError] = useState("");
  const [lockUntil, setLockUntil] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!lockUntil) return;

    const interval = setInterval(() => {
      const timeLeft = new Date(lockUntil) - Date.now();

      if (timeLeft <= 0) {
        setLockUntil(null);
        setRemainingTime(0);
        clearInterval(interval);
      } else {
        setRemainingTime(Math.ceil(timeLeft / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockUntil]);

  // const onSubmit = async (data) => {
  //   setServerError("");

  //   const result = await signIn("credentials", {
  //     email: data.email,
  //     password: data.password,
  //     redirect: false,
  //   });

  //   if (result?.error) {
  //     setServerError(result.error);
  //   } else {
  //     window.location.href = "/dashboard";
  //   }
  // };

  const onSubmit = async (data) => {
    setServerError("");

    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      if (result.lockUntil) {
        setLockUntil(result.lockUntil);
        setServerError("Account locked");
      } else {
        setServerError(result.message);
      }
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
      {serverError && (
        <p className="text-xs text-red-500 text-center">{serverError}</p>
      )}
      {lockUntil && (
        <p className="text-xs text-red-500 text-center">
          {" "}
          Try again in {remainingTime} seconds.
        </p>
      )}{" "}
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
        placeholder="Enter your password"
        registration={register("password")}
        error={errors.password?.message}
      />
      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor="remember"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300"
        >
          <Checkbox id="remember" {...register("remember")} />
          Remember me
        </Label>
        <Link
          href="/forgot-password"
          className="text-sm text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200"
        >
          Forgot password?
        </Link>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !!lockUntil}
      >
        {lockUntil
          ? `Locked (${remainingTime}s)`
          : isSubmitting
            ? "Signing in..."
            : "Sign in"}
      </Button>
      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        New to Zyplo?{" "}
        <Link
          href="/register"
          className="text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
export { loginSchema };
