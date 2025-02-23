"use client"

import { Button } from "@/components/ui/button"
import { Menu, LayoutDashboard, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/ui/logo"

export default function Navbar() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  const navItems = [
    { label: "Features", id: "features" },
    { label: "Roadmaps", id: "roadmaps" },
    { label: "Testimonials", id: "testimonials" },
    { label: "Contact", id: "contact" },
  ]

  const MobileNav = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] bg-black/95 border-white/10 p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <Logo showText={true} size="sm" />
          </div>
          
          <div className="flex flex-col p-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-left text-gray-300 hover:text-white transition-colors py-2"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-auto p-6 border-t border-white/10">
            {isLoaded && user ? (
              <div className="flex flex-col space-y-4">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:text-purple-400"
                  onClick={() => {
                    router.push("/dashboard")
                    setIsOpen(false)
                  }}
                >
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  Dashboard
                </Button>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full text-white hover:text-purple-400"
                  onClick={() => {
                    router.push("/sign-in")
                    setIsOpen(false)
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    router.push("/sign-up")
                    setIsOpen(false)
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Logo />

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="text-gray-300 hover:text-white transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {isLoaded && user ? (
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-white hover:text-purple-400"
              onClick={() => router.push("/dashboard")}
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Dashboard
            </Button>
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

      {/* Mobile Navigation */}
      <MobileNav />
    </motion.nav>
  )
}


