"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";



export default function Navbar() {
const router = useRouter();

const { data: session, isPending } = authClient.useSession();

async function handleSignOut() {
await authClient.signOut();
router.push("/signIn");
}

const navLinks = [
{ name: "Home", href: "/" },
{ name: "Browse Jobs", href: "/jobs" },
{ name: "Company", href: "/company" },
{ name: "Pricing", href: "/pricing" },
{ name: "Dashboard", href: `/dashboard/${session?.user.role}` },
];

return (
<header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#1c1c1e]/95 backdrop-blur-xl">
<nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">

    {/* Logo */}
    <Link href="/" className="shrink-0">
      <Image
        src="/assets/logo.png"
        alt="Hireloop logo"
        width={154}
        height={44}
        className="h-auto w-[100px] sm:w-[130px]"
        preload
      />
    </Link>

    {/* Desktop Navigation */}
    <div className="hidden items-center gap-8 md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
        >
          {link.name}
        </Link>
      ))}

      <div className="h-6 w-px bg-white/10" />

      {!isPending && (
        session ? (
          <div className="flex items-center gap-3">

            {/* Welcome User */}
            <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400">
                <UserRound size={17} />
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500">
                  Welcome back
                </span>
                <span className="max-w-[120px] truncate text-xs font-semibold text-white">
                  {session.user.name}
                </span>
              </div>
            </div>

            {/* Sign Out */}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="h-10 gap-2 border-white/10 bg-transparent text-gray-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={15} />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/signIn"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition hover:text-white"
            >
              Login
            </Link>

            <Button
              render={<Link href="/signUp" />}
              nativeButton={false}
              className="h-10 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              Get Started
            </Button>
          </div>
        )
      )}
    </div>

    {/* Mobile Navigation */}
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            />
          }
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-[300px] border-white/10 bg-[#1c1c1e] text-white"
        >
          <div className="mt-8 flex flex-col gap-6">

            {/* Mobile Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-400 transition hover:text-white"
              >
                {link.name}
              </Link>
            ))}

            <div className="h-px bg-white/10" />

            {!isPending && (
              session ? (
                <div className="flex flex-col gap-4">

                  {/* Mobile User Info */}
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400">
                      <UserRound size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        Welcome back
                      </p>
                      <p className="truncate text-sm font-semibold text-white">
                        {session.user.name}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full gap-2 border-white/10 bg-transparent text-gray-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/signIn"
                    className="rounded-lg border border-white/10 py-3 text-center text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Sign In
                  </Link>

                  <Button
                    render={<Link href="/signUp" />}
                    nativeButton={false}
                    className="w-full bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    Get Started
                  </Button>
                </div>
              )
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>

  </nav>
</header>

);
}