import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../financial-products/services/product.service';
import { of } from 'rxjs';
import { InputTextComponent } from '../input-text/input-text.component';
import { Product } from '../../../financial-products/interfaces/product';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['verifyIdExist']);
    spy.verifyIdExist.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      declarations: [FormComponent, InputTextComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: ProductService, useValue: spy }],
    }).compileComponents();

    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('id')).toBeTruthy();
    expect(component.productForm.get('name')).toBeTruthy();
    expect(component.productForm.get('description')).toBeTruthy();
    expect(component.productForm.get('logo')).toBeTruthy();
    expect(component.productForm.get('dateRelease')).toBeTruthy();
    expect(component.productForm.get('dateRevision')).toBeTruthy();
  });

  it('should mark form as invalid when empty', () => {
    expect(component.productForm.valid).toBeFalsy();
  });

  it('should mark id as invalid when less than 3 characters', () => {
    const idControl = component.productForm.get('id');
    idControl?.setValue('ab');
    expect(idControl?.valid).toBeFalsy();
    expect(idControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should mark id as valid when 3 or more characters', () => {
    const idControl = component.productForm.get('id');
    productServiceSpy.verifyIdExist.and.returnValue(of(false));
    idControl?.setValue('abc');
    expect(idControl?.valid).toBeTruthy();
  });

  it('should emit product on form submit', fakeAsync(() => {
    spyOn(component.onSubmit, 'emit');
    const testProduct = {
      id: 'test123',
      name: 'Test Product',
      description: 'This is a test product',
      logo: 'test-logo.png',
      dateRelease: '2023-01-01',
      dateRevision: '2024-01-01',
    };

    component.productForm.patchValue(testProduct);

    fixture.detectChanges();
    tick();

    component.onSubmitForm();

    expect(component.onSubmit.emit).toHaveBeenCalledWith({
      id: 'test123',
      name: 'Test Product',
      description: 'This is a test product',
      logo: 'test-logo.png',
      date_release: '2023-01-01',
      date_revision: '2024-01-01',
    });
  }));

  it('should disable id field when in update mode', () => {
    component.product = { id: 'existingId' } as Product;
    component.ngOnInit();
    expect(component.productForm.get('id')?.disabled).toBeTruthy();
  });

  it('should set idExists error when id already exists', fakeAsync(() => {
    productServiceSpy.verifyIdExist.and.returnValue(of(true));

    const idControl = component.productForm.get('id');
    idControl?.setValue('existingId');

    tick();

    expect(idControl?.hasError('idExists')).toBeTruthy();
  }));

  it('should not set idExists error when id does not exist', fakeAsync(() => {
    productServiceSpy.verifyIdExist.and.returnValue(of(false));

    const idControl = component.productForm.get('id');
    idControl?.setValue('newId');

    tick();

    expect(idControl?.hasError('idExists')).toBeFalsy();
  }));
});
