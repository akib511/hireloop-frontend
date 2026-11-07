  "use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
  import Link from "next/link";
import { Briefcase, Shield, UserSearch } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "seeker", label: "Seeker", icon: UserSearch },
  { value: "recruiter", label: "Recruiter", icon: Briefcase },
  { value: "admin", label: "Admin", icon: Shield },
];

  export default function SignUpForm () {
    
      const router = useRouter();


   async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const data = Object.fromEntries(formData.entries());

  // Confirm Password Check
  if (data.password !== data.confirmPassword) {
    console.log("Password does not match");
    return;
  }

  // Better Auth Signup
  const { data: user, error } = await authClient.signUp.email({
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
  });

  if (error) {
    console.log(error.message);
    return;
  }
router.push("/signIn");

  console.log(user);
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
              Create an Account
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Join hireloop and start your job search journey.
            </p>
          </div>

          {/* Form */}
          <form  onSubmit={handleSubmit} className="space-y-5" noValidate >

            {/* Account Type */}
            <fieldset className="space-y-2">
              
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <div key={value}>
                    <input
                      type="radio"
                      id={`role-${value}`}
                      name="role"
                      value={value}
                      defaultChecked={value === "seeker"}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`role-${value}`}
                      className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-white/10 bg-[#1a1a1a] px-2 py-3 text-center text-xs font-medium text-gray-400 transition hover:border-white/20 hover:text-gray-200 peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 peer-checked:text-indigo-300 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/40"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="John Doe"
                className="h-12 w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Create a password"
                className="h-12 w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-gray-500">
                Must be at least 8 characters long.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className="h-12 w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5">
              <input
                id="terms"
                type="checkbox"
                name="terms"
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-white/20 bg-[#1a1a1a] text-indigo-600 accent-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
              />
              <label
                htmlFor="terms"
                className="text-xs leading-relaxed text-gray-400"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-indigo-400 transition hover:text-indigo-300"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-indigo-400 transition hover:text-indigo-300"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
           
              type="submit"
              className="h-12 w-full rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/signIn"
              className="font-medium text-indigo-400 transition hover:text-indigo-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    );
  }