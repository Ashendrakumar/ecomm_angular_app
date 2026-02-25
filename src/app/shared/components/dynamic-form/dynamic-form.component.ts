import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Input, OnChanges, OnDestroy, OnInit, output, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { DynamicField, DynamicFormConfig, SelectField } from '../../../core/models/forms.model';

@Component({
  selector: 'app-dynamic-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent implements OnInit, OnDestroy, OnChanges {
  form!: FormGroup;
  formConfig = input<DynamicFormConfig>([]);
  formReady = output<FormGroup>();

  private destroy$ = new Subject<void>();
  constructor(private fb: FormBuilder) { }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.formConfig()?.length && changes['formConfig'].currentValue !== changes['formConfig'].previousValue) {
      this.createForm();
    }
  }

  ngOnInit(): void {
    // this.createForm();
  }

  isSelectField(field: DynamicField): field is SelectField {
    return field.type === 'select';
  }

  createForm() {
    console.log('Form Created');
    // Destroy old subscriptions first
    this.destroy$.next();
    const group: any = {};

    this.formConfig().forEach((field: any) => {
      group[field.name] = [{ value: field.value || '', disabled: field.disabled || false }, { updateOn: 'blur' },
      this.bindValidations(field.validators || [])
      ];
    });

    this.form = this.fb.group(group);

    // Emit form reference to parent
    this.formReady.emit(this.form);

    // Subscribe to form value changes for handling dependencies
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$),
        debounceTime(200),
        distinctUntilChanged()
      ).
      subscribe(value => {
        this.handleDependencies(value);
      });
  }

  private handleDependencies(value: any) {
    this.formConfig().forEach((field: any) => {
      if (field?.dependsOn) {
        const control = this.form.get(field.name);
        const shouldEnable = field.condition(value[field.dependsOn]);

        if (shouldEnable && control?.disabled) {
          control.enable({ emitEvent: false });
        }

        if (!shouldEnable && control?.enabled) {
          control.disable({ emitEvent: false });
        }
      }
    });
  }

  bindValidations(validators: any[]) {
    if (!validators.length) return null;
    const validList: any[] = [];

    validators.forEach(validator => {
      switch (validator.type) {
        case 'required':
          validList.push(Validators.required);
          break;
        case 'email':
          validList.push(Validators.email);
          break;
        case 'minLength':
          validList.push(Validators.minLength(validator.value));
          break;
        case 'maxLength':
          validList.push(Validators.maxLength(validator.value));
          break;
        case 'min':
          validList.push(Validators.min(validator.value));
          break;
        case 'max':
          validList.push(Validators.max(validator.value));
          break;
        case 'pattern':
          validList.push(Validators.pattern(validator.value));
          break;
      }
    });

    return validList;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.value);
  }
}
