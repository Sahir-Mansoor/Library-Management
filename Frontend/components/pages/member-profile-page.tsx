"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, MapPin, Calendar, Lock } from "lucide-react"

interface MemberProfilePageProps {
  userRole: string
  userName: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function MemberProfilePage({ userRole, userName, onNavigate, onLogout }: MemberProfilePageProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")

  const memberProfile = {
    name: userName,
    email: "john.member@example.com",
    phone: "+91 9876543210",
    address: "123 Library Street, City, State 12345",
    memberSince: "2023-01-15",
    membershipStatus: "Active",
    memberId: "M001",
  }

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      setPasswordMessage("Please fill in all fields")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match")
      return
    }
    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters")
      return
    }
    setPasswordMessage("Password changed successfully!")
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => {
      setShowPasswordModal(false)
      setPasswordMessage("")
    }, 2000)
  }

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

            {/* Profile Card */}
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

              {/* Profile Details */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-foreground">{memberProfile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-foreground">{memberProfile.phone}</p>
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

              <div className="mt-8 pt-8 border-t border-border">
                <Button
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </Card>
          </div>

          {showPasswordModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md shadow-lg">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">Change Password</h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {passwordMessage && (
                    <p
                      className={`text-sm mb-4 p-3 rounded-lg ${
                        passwordMessage.includes("successfully")
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {passwordMessage}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleChangePassword}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Change Password
                    </Button>
                    <Button
                      onClick={() => {
                        setShowPasswordModal(false)
                        setNewPassword("")
                        setConfirmPassword("")
                        setPasswordMessage("")
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
