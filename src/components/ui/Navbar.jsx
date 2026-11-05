"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Browse Jobs", href: "/jobs" },
  { name: "Company", href: "/company" },
  { name: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  return (
    <header className="w-full bg-[#1c1c1e]">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/assets/logo.png"
            alt="Hireloop logo"
            width={130}
            height={40}
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
              className="text-sm text-gray-300 transition-colors hover:text-white"
            >
              {link.name}
            </Link>
          ))}

          <div className="h-6 w-px bg-white/20" />

          <Link
            href="/login"
            className="text-sm text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Sign In
          </Link>

          <Button
            render={<Link href="/register" />}
            className="rounded-lg bg-indigo-600 px-5 text-white hover:bg-indigo-500"
          >
            Get Started
          </Button>
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
              className="border-white/10 bg-[#1c1c1e] text-white"
            >
              <div className="mt-8 flex flex-col gap-6">

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white"
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="h-px bg-white/10" />

                <Link href="/login" className="text-indigo-400">
                  Sign In
                </Link>

                <Button
                  render={<Link href="/register" />}
                  className="bg-indigo-600 hover:bg-indigo-500"
                >
                  Get Started
                </Button>

              </div>
            </SheetContent>
          </Sheet>
        </div>

      </nav>
    </header>
  );
}