"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { User, Mail, Phone, MapPin, Calendar, Lock } from "lucide-react"
import axios from "axios"

interface MemberProfilePageProps {
  userRole: string
  userId: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

interface MemberProfile {
  name: string
  email: string
  phone?: string
  address?: string
  memberSince: string
  membershipStatus: string
  memberId: string
}

export function MemberProfilePage({ userRole, userId, onNavigate, onLogout }: MemberProfilePageProps) {
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`http://localhost:5000/users/${userId}`)
        const user = res.data
        // Map backend response to frontend profile structure
        setMemberProfile({
          name: user.name,
          email: user.email,
          phone: user.phone || "Not provided",
          address: user.address || "Not provided",
          memberSince: new Date(user.createdAt).toLocaleDateString(),
          membershipStatus: user.status === "ACTIVE" ? "Active" : "Inactive",
          memberId: user.id,
        })
      } catch (err: any) {
        setError("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  if (loading) return <p className="text-center mt-10">Loading profile...</p>
  if (error || !memberProfile) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage="profile" onNavigate={onNavigate} onLogout={onLogout} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground mt-2">View your profile information</p>
            </div>

            <Card className="border-0 shadow-sm p-8 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pb-8 border-b border-border">
                <div className="bg-primary/10 p-6 rounded-lg">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{memberProfile.name}</h2>
                  <p className="text-muted-foreground mt-1">Member ID: {memberProfile.memberId}</p>
                  <p className="text-sm mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {memberProfile.membershipStatus}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-foreground">{memberProfile.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-foreground">{memberProfile.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                    <p className="text-foreground">{memberProfile.memberSince}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
