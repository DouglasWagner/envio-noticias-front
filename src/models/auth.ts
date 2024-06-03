export interface LoginOutput {
  success?: boolean
  message?: string
  data?: Data
}
export interface LoginInput {
  email?: string
  password?: string
}

interface Data {
  id?: string
  name?: string
  email?: string
  bio?: string
  mobile_phone?: string
  avatar_url?: string | File
  email_hash?: string
  token: string
  recovery_token: string
  recovery_expiration_date: string
  company: Company
  sector?: string | { id?: string; name?: string; description?: string }
}

interface Company {
  id?: string
  name?: string
  cnpj?: string
  size?: string
  city?: string
  state?: string
  area?: string
  created_at?: string
}
