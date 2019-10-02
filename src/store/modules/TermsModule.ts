import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import * as api from '@/store/api'

// TermsModule
// ---------------------------------------------- //

export interface TaxonomyTermResponse {
  terms: TaxonomyTerm[]
}

export interface TaxonomyTerm {
  id: number
  name: string
  active?: boolean
  count?: number
}

export interface CategoryTerm extends TaxonomyTerm {
  id: number
  name: string
  active?: boolean
  count?: number
}

export interface GenderTerm extends TaxonomyTerm {
  id: number
  name: string
  active?: boolean
  count?: number
}

export interface CountryTerm extends TaxonomyTerm {
  id: number
  name: string
  active?: boolean
  count?: number
}

export interface OriginTerm extends TaxonomyTerm {
  id: number
  name: string
  active?: boolean
  count?: number
}

export interface TermsModuleInterface {
  gender: GenderTerm[]
  country: CountryTerm[]
  origin: OriginTerm[]
  category: CategoryTerm[]
}

@Module({
  namespaced: true,
  name: 'terms',
  store,
})
export default class TermsModule extends VuexModule implements TermsModuleInterface {
  public gender: GenderTerm[] = []
  public country: CountryTerm[] = []
  public origin: OriginTerm[] = []
  public category: CategoryTerm[] = []


  @Mutation
  public async refresh() {
    console.log('Load Terms from Server...')

    // Gender
    const genderResponse = await api.getGenderTerms()
    console.log('Terms: gender', genderResponse)
    const gender = genderResponse.terms
    this.gender = gender

    // Country
    const country = await api.getCountryTerms()
    console.log('Terms: country', country)
    this.country = country.terms

    // Origin
    const origin = await api.getOriginTerms()
    console.log('Terms: origin', origin)
    this.origin = origin.terms

    // Category
    const category = await api.getCategoryTerms()
    console.log('Terms: category', category)
    this.category = category.terms
  }


}
