"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    label: "MAIN ZONE",
    href: "/main-zone",
  },
  {
    label: "VIP ZONE",
    href: "/vip-zone",
  },
  {
    label: "PS ZONE",
    href: "/ps-zone",
  },
  {
    label: "GAMEPLAY",
    href: "#",
    children: [
      { label: "RATES", href: "/rates" },
      { label: "TOURNAMENTS", href: "/tournaments" },
      { label: "EVENTS", href: "/events" },
    ],
  },
  {
    label: "ABOUT",
    href: "/about",
  },
]

export default function CyberpunkNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [glitchEffect, setGlitchEffect] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(
      () => {
        setGlitchEffect(true)
        setTimeout(() => setGlitchEffect(false), 150)
      },
      Math.random() * 5000 + 3000,
    )

    return () => clearInterval(glitchInterval)
  }, [])

  const toggleDropdown = (label: string) => {
    if (activeDropdown === label) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(label)
    }
  }

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-black/90 backdrop-blur-md" : "bg-black/70",
        glitchEffect && "animate-glitch",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className={cn(
                "text-yellow-300 font-bold text-xl tracking-wider transform transition-all duration-300",
                "hover:text-yellow-400 hover:scale-105",
                "relative after:absolute after:inset-0 after:bg-yellow-300/20 after:blur-lg after:opacity-70 after:-z-10",
                glitchEffect && "animate-text-glitch",
              )}
            >
              <span className="text-2xl">CYBER</span>
              <span className="text-2xl relative inline-block animate-pulse-slow">PUNK</span>
              <span className="text-blue-500 text-sm ml-1 tracking-widest">CANGGU</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.children ? (
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={cn(
                        "px-3 py-2 text-sm font-medium relative group",
                        "text-cyan-300 hover:text-cyan-100",
                        "transition-all duration-300 ease-in-out",
                        "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-cyan-400",
                        "after:transition-all after:duration-300 hover:after:w-full",
                        "focus:outline-none",
                      )}
                    >
                      {item.label}
                      <ChevronDown className="inline ml-1 h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "px-3 py-2 text-sm font-medium relative group",
                        "text-cyan-300 hover:text-cyan-100",
                        "transition-all duration-300 ease-in-out",
                        "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-cyan-400",
                        "after:transition-all after:duration-300 hover:after:w-full",
                        "focus:outline-none",
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {item.children && (
                    <div
                      className={cn(
                        "absolute left-0 mt-2 w-48 rounded-md shadow-lg",
                        "bg-black border border-pink-500/30",
                        "transform transition-all duration-300 origin-top-right",
                        "backdrop-blur-md",
                        activeDropdown === item.label
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95 pointer-events-none",
                      )}
                    >
                      <div className="py-1 relative">
                        {/* Neon border effect */}
                        <div className="absolute inset-0 rounded-md border border-pink-500 opacity-50"></div>
                        <div className="absolute inset-0 rounded-md border border-pink-500 blur-sm opacity-70"></div>

                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={cn(
                              "block px-4 py-2 text-sm text-pink-300",
                              "hover:bg-pink-900/30 hover:text-pink-100",
                              "transition-colors duration-200",
                            )}
                            onClick={() => setActiveDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* CTA Button */}
              <Link
                href="/signup"
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md",
                  "bg-yellow-500/10 text-yellow-300 border border-yellow-500/50",
                  "hover:bg-yellow-500/20 transition-all duration-300",
                  "relative overflow-hidden group",
                  "after:absolute after:inset-0 after:bg-yellow-400/20 after:blur-md after:opacity-0",
                  "after:transition-opacity after:duration-300 hover:after:opacity-100 after:-z-10",
                )}
              >
                <span className="relative z-10">E-SPORTS CENTER</span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-md",
                "text-pink-300 hover:text-pink-100 hover:bg-pink-900/30",
                "transition-colors duration-300 focus:outline-none",
              )}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
          "border-t border-pink-500/30 backdrop-blur-md",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-base font-medium",
                      "text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100",
                      "flex justify-between items-center transition-colors duration-200",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        activeDropdown === item.label && "transform rotate-180",
                      )}
                    />
                  </button>

                  {/* Mobile dropdown */}
                  <div
                    className={cn(
                      "pl-4 transition-all duration-200 overflow-hidden border-l border-pink-500/30 ml-3",
                      activeDropdown === item.label ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={cn(
                          "block px-3 py-2 rounded-md text-base font-medium",
                          "text-pink-300 hover:bg-pink-900/30 hover:text-pink-100",
                          "transition-colors duration-200",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    "text-cyan-300 hover:bg-cyan-900/30 hover:text-cyan-100",
                    "transition-colors duration-200",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          {/* Mobile CTA */}
          <Link
            href="/signup"
            className={cn(
              "block px-3 py-2 rounded-md text-base font-medium text-center",
              "bg-yellow-500/10 text-yellow-300 border border-yellow-500/50",
              "hover:bg-yellow-500/20 transition-all duration-300 mx-2 mt-4",
            )}
            onClick={() => setIsOpen(false)}
          >
            E-SPORTS CENTER
          </Link>
        </div>
      </div>
    </nav>
  )
}
