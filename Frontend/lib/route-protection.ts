export type UserRole = "ADMIN" | "LIBRARIAN" | "MEMBER"

export const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: [
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
  LIBRARIAN: [
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
  MEMBER: ["dashboard", "browse-books", "issued-books", "my-fines", "borrowing-history", "profile"],
}

export function canAccessPage(userRole: string, pageId: string): boolean {
  const role = userRole as UserRole
  if (!role || !rolePermissions[role]) return false
  return rolePermissions[role].includes(pageId)
}
