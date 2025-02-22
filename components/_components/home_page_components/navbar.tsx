"use client"

import { Button } from "@/components/ui/button"
import { Bot, Menu } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import type React from "react"
import { useRouter } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Link href="/" className="flex items-center space-x-2">
        <Bot className="w-8 h-8 text-purple-500" />
        <span className="text-white font-medium text-xl">LearningPath AI</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <NavLink href="/features">Features</NavLink>
        <NavLink href="/testimonials">Testimonials</NavLink>
        <NavLink href="/pricing">Pricing</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        {isLoaded && user ? (
          <div className="flex items-center space-x-4">
           
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <>
            <Button 
              variant="ghost" 
              className="text-white hover:text-purple-400"
              onClick={() => router.push("/sign-in")}
            >
              Sign In
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => router.push("/sign-up")}
            >
              Get Started
            </Button>
          </>
        )}
      </div>

      <Button variant="ghost" size="icon" className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </Button>
    </motion.nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-300 hover:text-white transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full" />
    </Link>
  )
}

