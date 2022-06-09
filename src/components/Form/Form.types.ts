import { Experience, Form, Regions } from '../../types/initialParams.types';

interface FormSubmit {
    name: string,
    experience: Array<Experience>,
    formRegions: Regions
}
export interface FormProps extends Form {
    regions: Regions,
    changeNewInDays: () => void,
    clearKeywords: () => void,
    formSubmit: (payload: FormSubmit) => void
}

export interface FormGetState {
    form: Form,
    regions: Regions
}
