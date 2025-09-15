export interface Owner {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

export interface CreateOwnerDto {
  name: string
  email: string
  phone: string
}
