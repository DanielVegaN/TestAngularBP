import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs';
import { ProductService } from '../../../financial-products/services/product.service';
import { Product } from '../../../financial-products/interfaces/product';

@Component({
  selector: 'shared-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
  @Input()
  public product?: Product = {} as Product;

  public isUpdateOperation: boolean = false;
  @Output()
  public onSubmit: EventEmitter<Product> = new EventEmitter<Product>();

  productForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    this.isUpdateOperation = !!this.product?.id;
    this.initializeForm();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      id: [
        {
          value: this.product?.id || '',
          disabled: false,
        },
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10),
          ],
          asyncValidators: [this.checkIfIdExist(this.productService)],
        },
      ],
      name: [
        this.product?.name || '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        this.product?.description || '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [this.product?.logo || '', [Validators.required]],
      dateRelease: [this.product?.date_release, [Validators.required]],
      dateRevision: [
        this.product?.date_revision || '',
        [Validators.required, this.dateRevisionValidationn('dateRelease')],
      ],
    });

    this.productForm.controls['dateRelease'].valueChanges.subscribe({
      next: () =>
        this.productForm.controls['dateRevision'].updateValueAndValidity(),
    });

    if (this.isUpdateOperation) {
      const idField = this.productForm.get('id');
      if (idField) {
        idField.disable();
        idField.clearValidators();
        idField.clearAsyncValidators();
        idField.setErrors(null);
        idField.updateValueAndValidity({ emitEvent: false });
      }
    } else {
      const idField = this.productForm.get('id');
      if (idField) {
        idField.enable();
        idField.setValidators([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ]);
        idField.setAsyncValidators(this.checkIfIdExist(this.productService));
        idField.updateValueAndValidity();
      }
    }
  }

  private dateRevisionValidationn(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      const dateRevControl = control.parent?.get(matchTo);

      if (!dateRevControl || !control.value) {
        return null;
      }

      const dateRev = this.dateFormat(dateRevControl.value);
      const dateRel = this.dateFormat(control.value);

      const diffTime = dateRel.getTime() - dateRev.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isExactlyOneYear = diffDays === 365 || diffDays === 366;

      if (!isExactlyOneYear) {
        return { notExactlyOneYear: true };
      }

      return null;
    };
  }

  private checkIfIdExist(productServ: ProductService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return productServ
        .verifyIdExist(control.value)
        .pipe(map((result: boolean) => (result ? { idExists: true } : null)));
    };
  }

  private dateFormat(dateString: string): Date {
    if (!dateString) return new Date();

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  }

  onSubmitForm(): void {
    let newProduct: Product = {} as Product;

    newProduct.id = this.productForm.value.id || this.product?.id;
    newProduct.name = this.productForm.value.name;
    newProduct.description = this.productForm.value.description;
    newProduct.logo = this.productForm.value.logo;
    newProduct.date_release = this.productForm.value.dateRelease;
    newProduct.date_revision = this.productForm.value.dateRevision;

    this.onSubmit.emit(newProduct);
    this.productForm.reset();
  }
}
