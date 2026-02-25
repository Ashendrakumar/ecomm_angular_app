
export type ValidatorType = 'required' | 'email' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern';

export interface DynamicValidator {
    type: ValidatorType;
    message: string;
    value?: number | string;
}
export type FieldType = 'text' | 'email' | 'number' | 'select';

export interface SelectField extends BaseField<string> {
    type: 'select';
    options: { label: string; value: string; disabled?: boolean; }[];
}

export interface BaseField<T = any> {
    type: FieldType;
    label: string;
    name: string;
    value?: T;
    disabled?: boolean;
    validators?: DynamicValidator[];

    // Dependency logic
    dependsOn?: string;
    condition?: (value: any) => boolean;
}
export type DynamicField = BaseField | SelectField;
export type DynamicFormConfig = DynamicField[];