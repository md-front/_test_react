export interface Salary {
  currency: string,
  from: number,
  gross: boolean,
  component: Array<string>,
  to: number
}
export interface CalcCurrencyProps {
  salary: Salary,
  type: string,
  usdCurrency: number,
}
export interface Employer {
  id: string,
  name: string,
  logoUrl: string
}
export interface Vacancy {
  id: string,
  name: string,
  createdAt: string,
  alternateUrl: string,
  salary: Salary,
  employer: Employer,
  snippet: string,
  archived: boolean,
  exp3: boolean,
  exp6: boolean,
  isJun: boolean,
  sort: string,
  isNew: boolean,
  isSalary: boolean,
  isDel?: boolean,
}

export interface VacancyProps {
  vacancy: Vacancy,
  addToBlacklist: (e: any, vacancy: Vacancy) => void
}

export interface VacancyWrap {
  vacancy: Vacancy
}
