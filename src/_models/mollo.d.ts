// Responses
// ---------------------------------------------- //
export interface MolloResponse {
  name?: string
  version?: string
  status: boolean
  action?: 'load' | 'update' | 'create' | 'delete'
  message?: string
  nid?: number
}

// Taxonomy
// ---------------------------------------------- //
export interface Taxonomy {
  id: number
  name: string
  active?: boolean
}

interface CategoryTerm extends Taxonomy {
  id: number
  name: string
  active?: boolean
}

interface GenderTerm extends Taxonomy {
  id: number
  name: string
  active?: boolean
}

interface CountryTerm extends Taxonomy {
  id: number
  name: string
  active?: boolean
}

interface OriginTerm extends Taxonomy {
  id: number
  name: string
  active?: boolean
}

export interface SubscriberGroupTerm extends Taxonomy {
  id: number
  name: string
  subscribers?: number
  active?: boolean
}
