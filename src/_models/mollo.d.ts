// Responses
// ---------------------------------------------- //

export interface MolloTerm {
  id: number
  name: string
  active?: boolean
  count?: number
}

export interface MolloResponse {
  name?: string
  version?: string
  status: boolean
  action?: 'load' | 'update' | 'create' | 'delete'
  message?: string
  id?: number
  error?: string
}

export interface MolloTermResponse {
  name: string
  version: string
  terms: MolloTerm[]
}

export interface MolloInvalidEmailResponse {
  name: string
  version: string
  addresses: string[]
}
