export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const TEST_USERS = [
  { email: "test@example.com", password: "password123", name: "Test User" },
  { email: "demo@pcos.app", password: "demo123", name: "Demo User" },
]

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  // Check against test users
  const testUser = TEST_USERS.find((u) => u.email === email && u.password === password)
  if (testUser) {
    const user: User = {
      id: crypto.randomUUID(),
      email: testUser.email,
      name: testUser.name,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem("pcos_auth", JSON.stringify({ user, isAuthenticated: true }))
    return { success: true, user }
  }

  // Check registered users
  const registeredUsers = getRegisteredUsers()
  const registeredUser = registeredUsers.find((u) => u.email === email && u.password === password)
  if (registeredUser) {
    const user: User = {
      id: registeredUser.id,
      email: registeredUser.email,
      name: registeredUser.name,
      createdAt: registeredUser.createdAt,
    }
    localStorage.setItem("pcos_auth", JSON.stringify({ user, isAuthenticated: true }))
    return { success: true, user }
  }

  return { success: false, error: "Invalid email or password" }
}

export function register(
  email: string,
  password: string,
  name: string,
): { success: boolean; user?: User; error?: string } {
  const registeredUsers = getRegisteredUsers()

  // Check if email already exists
  if (registeredUsers.some((u) => u.email === email) || TEST_USERS.some((u) => u.email === email)) {
    return { success: false, error: "Email already registered" }
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    name,
    createdAt: new Date().toISOString(),
  }

  registeredUsers.push({ ...user, password })
  localStorage.setItem("pcos_registered_users", JSON.stringify(registeredUsers))
  localStorage.setItem("pcos_auth", JSON.stringify({ user, isAuthenticated: true }))

  return { success: true, user }
}

export function logout(): void {
  localStorage.removeItem("pcos_auth")
}

export function getAuthState(): AuthState {
  if (typeof window === "undefined") return { user: null, isAuthenticated: false }
  const stored = localStorage.getItem("pcos_auth")
  if (!stored) return { user: null, isAuthenticated: false }
  return JSON.parse(stored)
}

function getRegisteredUsers(): Array<User & { password: string }> {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("pcos_registered_users")
  return stored ? JSON.parse(stored) : []
}

// Language preference
export function getLanguagePreference(): string {
  if (typeof window === "undefined") return "en"
  return localStorage.getItem("pcos_language") || "en"
}

export function setLanguagePreference(lang: string): void {
  localStorage.setItem("pcos_language", lang)
}
