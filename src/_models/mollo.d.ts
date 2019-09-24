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
}

interface CategoryTerm extends Taxonomy {
  id: number
  name: string
}

interface GenderTerm extends Taxonomy {
  id: number
  name: string
}

interface CountryTerm extends Taxonomy {
  id: number
  name: string
}

interface OriginTerm extends Taxonomy {
  id: number
  name: string
}

export interface SubscriberGroupTerm extends Taxonomy {
  id: number
  name: string
  subscribers?: number
}
