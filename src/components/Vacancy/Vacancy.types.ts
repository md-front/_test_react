// TODO
export interface Salary {
    currency: string,
    from: number,
    gross: boolean,
    to: number
}
export interface Employer {
    id: string,
    name: string,
    url: string,
    alternate_url: string,
    logo_urls: {
        '90': string,
        '240': string,
        'original': string
    },
    vacancies_url: string,
    trusted: boolean
}
export interface Vacancy {
    id: string,
    premium: boolean,
    name: string,
    department: null,
    has_test: boolean,
    response_letter_required: boolean,
    // area: '{id: "1", name: "Москва", url: "https://api.hh.ru/a…}',
    // salary: '{currency: "EUR", from: 4000, gross: true, to: 7000}',
    // type: '{id: "open", name: "Открытая"}',
    area: string,
    salary: Salary,
    type: string,
    address: null,
    response_url: null,
    sort_point_distance: null,
    published_at: string,
    created_at: string,
    archived: boolean,
    apply_alternate_url: string,
    insider_interview: null,
    url: string,
    alternate_url: string,
    // relations: '[]',
    // snippet: '{requirement: "Иметь опыт разработки и поддержки Va…}',
    relations: string,
    employer: Employer,
    snippet: string,
    contacts: null,
    // schedule: '{id: "remote", name: "Удаленная работа"}',
    schedule: string,
    // working_days: '[]',
    // working_time_intervals: '[]',
    // working_time_modes: '[]',
    working_days: string,
    working_time_intervals: string,
    working_time_modes: string,
    accept_temporary: boolean,
    exp3: boolean,
    // sort: '{name: "is_new", sortValue: 5}',
    sort: string,
    isNew: boolean,
    isSalary: boolean,
    isDel?: boolean,
}

// TODO
export interface VacancyWrap {
    vacancy: Vacancy
}
