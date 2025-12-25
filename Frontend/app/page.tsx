"use client"

import { useState } from "react"
import { LoginPage } from "@/components/pages/login-page"
import { DashboardPage } from "@/components/pages/dashboard-page"
import { BooksPage } from "@/components/pages/books-page"
import { MembersPage } from "@/components/pages/members-page"
import { UsersPage } from "@/components/pages/users-page"
import { IssueBookPage } from "@/components/pages/issue-book-page"
import { ReturnBookPage } from "@/components/pages/return-book-page"
import { FinesPage } from "@/components/pages/fines-page"
import { HomePage } from "@/components/pages/home-page"
import { MemberDashboardPage } from "@/components/pages/member-dashboard-page"
import { MemberBrowseBooksPage } from "@/components/pages/member-browse-books-page"
import { MemberIssuedBooksPage } from "@/components/pages/member-issued-books-page"
import { MemberFinesPage } from "@/components/pages/member-fines-page"
import { MemberBorrowingHistoryPage } from "@/components/pages/member-borrowing-history-page"
import { MemberProfilePage } from "@/components/pages/member-profile-page"
import { AccessDeniedPage } from "@/components/access-denied-page"
import { canAccessPage } from "@/lib/route-protection"

type Page =
  | "home"
  | "login"
  | "dashboard"
  | "books"
  | "members"
  | "users"
  | "issue-book"
  | "return-book"
  | "fines"
  | "browse-books"
  | "issued-books"
  | "my-fines"
  | "borrowing-history"
  | "profile"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [userRole, setUserRole] = useState<string>("")
  const [userName, setUserName] = useState<string>("")

  const handleLogin = (role: string, name: string) => {
    setUserRole(role)
    setUserName(name)
    setCurrentPage(role === "member" ? "dashboard" : "dashboard")
  }

  const handleNavigate = (page: string) => {
    if (userRole && !canAccessPage(userRole, page)) {
      console.log(`[v0] Access denied for ${userRole} to page ${page}`)
      return
    }
    setCurrentPage(page as Page)
  }

  const handleLogout = () => {
    setCurrentPage("home")
    setUserRole("")
    setUserName("")
  }

  const isAccessDenied =
    userRole && currentPage !== "home" && currentPage !== "login" && !canAccessPage(userRole, currentPage)

  if (isAccessDenied) {
    return <AccessDeniedPage userRole={userRole} onNavigate={handleNavigate} onLogout={handleLogout} />
  }

  return (
    <div>
      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
      {currentPage === "login" && <LoginPage onLogin={handleLogin} />}

      {/* Admin/Librarian Routes */}
      {userRole !== "member" && (
        <>
          {currentPage === "dashboard" && (
            <DashboardPage
              userRole={userRole}
              userName={userName}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          )}
          {currentPage === "books" && (
            <BooksPage userRole={userRole} onNavigate={handleNavigate} onLogout={handleLogout} />
          )}
          {currentPage === "members" && (
            <MembersPage userRole={userRole} onNavigate={handleNavigate} onLogout={handleLogout} />
          )}
          {currentPage === "users" && (
            <UsersPage userRole={userRole} onNavigate={handleNavigate} onLogout={handleLogout} />
          )}
          {currentPage === "issue-book" && (
            <IssueBookPage userRole={userRole} onNavigate={handleNavigate} onLogout={handleLogout} />
          )}
          {currentPage === "return-book" && (
            <ReturnBookPage userRole={userRole} onNavigate={handleNavigate} onLogout={handleLogout} />
          )}
          {currentPage === "fines" && (
            <FinesPage userRole={userRole} onNavigate={handleNavigate} onLogout={handleLogout} />
          )}
        </>
      )}

      {/* Member Routes */}
      {userRole === "member" && (
        <>
          {currentPage === "dashboard" && (
            <MemberDashboardPage
              userRole={userRole}
              userName={userName}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          )}
          {currentPage === "browse-books" && (
            <MemberBrowseBooksPage userRole={userRole} onNavigate={handleNavigate} onLogout={handleLogout} />
          )}
          {currentPage === "issued-books" && (
            <MemberIssuedBooksPage userRole={userRole} onNavigate={handleNavigate} onLogout={handleLogout} />
          )}
          {currentPage === "my-fines" && (
            <MemberFinesPage userRole={userRole} onNavigate={handleNavigate} onLogout={handleLogout} />
          )}
          {currentPage === "borrowing-history" && (
            <MemberBorrowingHistoryPage userRole={userRole} onNavigate={handleNavigate} onLogout={handleLogout} />
          )}
          {currentPage === "profile" && (
            <MemberProfilePage
              userRole={userRole}
              userName={userName}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          )}
        </>
      )}
    </div>
  )
}
