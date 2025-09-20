export type Status = 'available' | 'in_use' | 'expired' | 'retired'

export type IdType = {
  code: string
  name: string
}

export type Row = {
  id: number
  code: string
  full_id: string
  status: Status
  username: string | null
  password: string | null
  claimed_at: string | null
  lease_expires_at: string | null
  created_at: string | null
  released_at: string | null
  type_id: number
}
