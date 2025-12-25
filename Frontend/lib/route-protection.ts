export type UserRole = "admin" | "librarian" | "member"

export const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "dashboard",
    "books",
    "members",
    "issue-book",
    "return-book",
    "fines",
    "users",
    "browse-books",
    "issued-books",
    "my-fines",
    "borrowing-history",
    "profile",
  ],
  librarian: [
    "dashboard",
    "books",
    "members",
    "issue-book",
    "return-book",
    "fines",
    "users",
    "browse-books",
    "issued-books",
    "my-fines",
    "borrowing-history",
    "profile",
  ],
  member: ["dashboard", "browse-books", "issued-books", "my-fines", "borrowing-history", "profile"],
}

export function canAccessPage(userRole: string, pageId: string): boolean {
  const role = userRole as UserRole
  if (!role || !rolePermissions[role]) return false
  return rolePermissions[role].includes(pageId)
}
