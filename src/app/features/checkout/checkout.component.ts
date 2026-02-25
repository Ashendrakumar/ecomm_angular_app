import { Component } from '@angular/core';
import { DynamicFormComponent } from "../../shared/components/dynamic-form/dynamic-form.component";
import { FormGroup, Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../core/models/forms.model';
const FORM_CONFIG: DynamicFormConfig = [
  {
    type: 'text',
    label: 'First Name',
    name: 'firstName',
    value: '',
    validators: [
      { type: 'required', message: 'First name is required' },
      { type: 'minLength', value: 3, message: 'Minimum 3 characters' }
    ]
  },
  {
    type: 'email',
    label: 'Email',
    name: 'email',
    value: '',
    disabled: false,
    validators: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' }
    ]
  },
  {
    type: 'number',
    label: 'Age',
    name: 'age',
    value: '',
    validators: [
      { type: 'required', message: 'Age is required' },
      { type: 'min', value: 18, message: 'Minimum age is 18' }
    ]
  },
  {
    type: 'select',
    label: 'Country',
    name: 'country',
    value: '',
    options: [
      { label: 'Select Country', value: '', disabled: true },
      { label: 'USA', value: 'usa' },
      { label: 'Canada', value: 'canada' },
      { label: 'UK', value: 'uk' }],
    validators: [
      { type: 'required', message: 'Country is required' }
    ]
  },
  {
    type: 'text',
    label: 'Driving License Number',
    value: '',
    disabled: true,
    name: 'license',
    dependsOn: 'age',
    condition: (value: any) => value >= 18,
  }
];


@Component({
  selector: 'app-checkout',
  imports: [DynamicFormComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  formConfig: DynamicFormConfig = FORM_CONFIG;
  childForm!: FormGroup;

  captureForm(form: FormGroup) {
    this.childForm = form;
    this.childForm.valueChanges.subscribe(value => {
      this.onFormChange(value);
    });
  }

  onFormChange(value: any) {
    console.log('Form changed in Parent:', value);
  }
}
