"use client";

import { Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackURL") || "/";

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const { error } = await authClient.signIn.email({
      email: data.email, // required, The email address of the user.
      password: data.password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
      rememberMe: true, // If false, the user will be signed out when the browser is closed. (optional) (default: true)
      callbackURL: callbackURL, // An optional URL to redirect to after the user signs in. (optional)
    });

    if (error) {
      console.log(error.message);
      return;
    }

    // Send the user back to where they came from (e.g. the job they tried to apply to)
    router.push(callbackURL);
    router.refresh();
  }
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12 sm:px-6 lg:px-8">

      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px] sm:h-[400px] sm:w-[400px]" />

      {/* Form Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111111]/90 p-6 shadow-2xl backdrop-blur-sm sm:p-8">

        {/* Logo */}
        <Link
          href="/"
          className="mb-8 block text-center transition-opacity hover:opacity-80"
        >
          <span className="text-2xl font-bold text-blue-500">hire</span>
          <span className="text-2xl font-bold text-orange-500">loop</span>
        </Link>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to continue your job search journey.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-12 w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="shrink-0 text-xs text-indigo-400 transition hover:text-indigo-300"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="h-12 w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="h-12 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signUp"
            className="font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

// useSearchParams() must live under a <Suspense> boundary so the route can be prerendered
export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}