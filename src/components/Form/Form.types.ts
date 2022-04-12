import { Experience } from '../../types/common';
import { Form, Regions } from '../../types/initialParams';

interface FormSubmit {
    name: string,
    experience: Experience,
    formRegions: Regions
}
export interface FormProps extends Form {
    regions: Regions,
    changeNewInDays: () => void,
    clearKeywords: () => void,
    formSubmit: (payload: FormSubmit) => void,
    changeSelectedRegion: () => void,
}

// TODO
export interface FormGetState {
    form: Form,
    regions: Regions
}
