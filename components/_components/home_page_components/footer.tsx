"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Brain, Facebook, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  product: [
    { name: "Features", href: "/features" },
    { name: "Roadmap", href: "/roadmap" },
    { name: "Documentation", href: "/docs" },
    { name: "API", href: "/api" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
  resources: [
    { name: "Community", href: "/community" },
    { name: "Help Center", href: "/help" },
    { name: "Partners", href: "/partners" },
    { name: "Status", href: "/status" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Licenses", href: "/licenses" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/jadon-narendrasinh-9aa772243" },
  { name: "GitHub", icon: Github, href: "https://github.com/Narendra-Rajput003" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
];

export function Footer() {
  return (
    <footer className="bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden border-t border-white/10">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
      
      <div className="container py-12 md:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4"
          >
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-purple-500" />
              <span className="text-2xl font-bold text-white">LearningPath.ai</span>
            </Link>
            <p className="mt-4 text-gray-400">
              Empowering learners worldwide with AI-driven personalized learning paths.
              Transform your career journey with intelligent guidance.
            </p>
            <div className="mt-6">
              <h3 className="font-semibold mb-3 text-white">Subscribe to our newsletter</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-400"
                />
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Subscribe</Button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <h3 className="font-semibold mb-3 text-white capitalize">{category}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-gray-400 hover:text-purple-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} LearningPath.ai. All rights reserved.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
