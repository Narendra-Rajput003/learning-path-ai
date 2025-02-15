"use client"

import { Button } from "@/components/ui/button"
import { Bot, Menu } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import type React from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signIn("credentials", {
        redirect: true,
        callbackUrl: "/dashboard", // Redirect after successful sign-in
      })
    } catch (error) {
      console.error("Sign-in failed:", error)
    }
  }

  const handleSignUp = () => {

    router.push("/signup")

  }

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
        <NavLink href="/how-it-works">Testionomals</NavLink>
        <NavLink href="/examples">Pricing</NavLink>
        <NavLink href="/pricing">Contact Us</NavLink>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <Button variant="ghost" className="text-white hover:text-purple-400" onClick={handleSignIn}>
          Sign In
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSignUp}>Get Started</Button>
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

