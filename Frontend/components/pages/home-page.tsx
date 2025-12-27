"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, ArrowRightLeft, DollarSign, LogIn, ArrowRight } from "lucide-react"

interface HomePageProps {
  onNavigate: (page: string) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: BookOpen,
      title: "Book Management",
      description: "Organize and track your entire book collection efficiently",
      color: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      icon: Users,
      title: "Member Management",
      description: "Manage member profiles and track their borrowing history",
      color: "bg-purple-500/10",
      iconColor: "text-purple-600",
    },
    {
      icon: ArrowRightLeft,
      title: "Issue & Return Books",
      description: "Streamlined process for issuing and returning books",
      color: "bg-green-500/10",
      iconColor: "text-green-600",
    },
    {
      icon: DollarSign,
      title: "Fine Tracking",
      description: "Automatic fine calculation for overdue books",
      color: "bg-orange-500/10",
      iconColor: "text-orange-600",
    },
  ]

  const stats = [
    { label: "Total Books", value: "2,543" },
    { label: "Active Members", value: "456" },
    { label: "Books Issued Today", value: "42" },
    { label: "Overdue Books", value: "8" },
  ]

  const steps = [
    {
      number: "1",
      title: "Login as Admin, Librarian, or Member",
      description: "Secure authentication with role-based access control",
    },
    {
      number: "2",
      title: "Manage or Browse Books",
      description: "Search, add, edit, and organize your library collection",
    },
    {
      number: "3",
      title: "Issue, Return & Track Fines",
      description: "Process book transactions and manage penalties",
    },
  ]

  return (
    <div className="w-full bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-bold text-lg text-foreground">LibraryHub</h1>
          </div>
          <Button onClick={() => onNavigate("login")} className="gap-2">
            <LogIn className="w-4 h-4" />
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">Library Management System</h2>
              <p className="text-lg text-primary-foreground/90 mb-8">
                Manage books, members, and borrowing efficiently. Digitize your library operations with our
                comprehensive management platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => onNavigate("login")}
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Login
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    const element = document.getElementById("features")
                    element?.scrollIntoView({ behavior: "smooth" })
                  }}
                  size="lg"
                  variant="outline"
className="bg-red-500 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Explore Library
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex h-80 bg-primary-foreground/10 rounded-2xl items-center justify-center border border-primary-foreground/20">
              <div className="text-center">
                <BookOpen className="w-24 h-24 text-primary-foreground/50 mx-auto mb-4" />
                <p className="text-primary-foreground/70 font-medium">Library Management</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Everything you need to manage your library efficiently in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className={`${feature.color} p-4 rounded-lg w-fit mb-4`}>
                      <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-28 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">Get started with LibraryHub in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute left-6 top-12 w-0.5 h-24 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">System Statistics</h2>
            <p className="text-lg text-muted-foreground">Current library metrics and activity</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <Card key={idx} className="border-0 shadow-sm text-center">
                <CardContent className="p-8">
                  <p className="text-sm text-muted-foreground mb-3">{stat.label}</p>
                  <p className="text-4xl font-bold text-primary">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Digitize Your Library Today</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join libraries around the world using LibraryHub to streamline their operations and improve member
            experience.
          </p>
          <Button
            onClick={() => onNavigate("login")}
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground">LibraryHub</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional library management system for modern institutions
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      const element = document.getElementById("features")
                      element?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("login")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Login
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground">support@libraryhub.com</p>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 LibraryHub. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
