// Mock user database with predefined roles
export const mockUsers = [
  {
    id: "admin001",
    email: "admin@library.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "librarian001",
    email: "librarian@library.com",
    password: "librarian123",
    name: "John Librarian",
    role: "librarian",
  },
  {
    id: "member001",
    email: "member@library.com",
    password: "member123",
    name: "Jane Member",
    role: "member",
  },
  {
    id: "demo001",
    email: "demo@library.com",
    password: "demo123",
    name: "Demo User",
    role: "admin",
  },
]

export function validateCredentials(email: string, password: string) {
  const user = mockUsers.find((u) => u.email === email && u.password === password)
  return user || null
}
