export interface Profile {
  name?: string
  email?: string
  sector?: { id?: string; name: string; description?: string } | string
  bio?: string
  image?: File | string
}
