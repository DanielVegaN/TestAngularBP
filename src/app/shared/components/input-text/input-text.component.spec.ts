import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { InputTextComponent } from './input-text.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  template: '<shared-input-text [formControl]="control"></shared-input-text>',
})
class TestHostComponent {
  control = new FormControl('');
}

describe('InputTextComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let inputComponent: InputTextComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputTextComponent, TestHostComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

    inputComponent = hostFixture.debugElement.children[0].componentInstance;
  });

  it('should create', () => {
    expect(inputComponent).toBeTruthy();
  });

  it('should set default values for inputs', () => {
    expect(inputComponent.label).toBe('');
    expect(inputComponent.type).toBe('text');
  });

  it('should set custom values for inputs', () => {
    inputComponent.label = 'Test Label';
    inputComponent.type = 'password';
    expect(inputComponent.label).toBe('Test Label');
    expect(inputComponent.type).toBe('password');
  });

  it('should have a valid control', () => {
    expect(inputComponent.control).toBeTruthy();
    expect(inputComponent.control instanceof FormControl).toBeTruthy();
  });

  it('should update control value', () => {
    hostComponent.control.setValue('test value');
    hostFixture.detectChanges();
    expect(inputComponent.control.value).toBe('test value');
  });

  it('should clear errors when control becomes disabled', fakeAsync(() => {
    hostComponent.control.setValidators(Validators.required);
    hostComponent.control.setValue('');
    hostComponent.control.markAsTouched();
    hostFixture.detectChanges();
    expect(hostComponent.control.errors).toBeTruthy();

    hostComponent.control.disable();
    tick(0);
    hostFixture.detectChanges();

    expect(hostComponent.control.errors).toBeNull();
  }));

  it('should not clear errors when control remains enabled', fakeAsync(() => {
    hostComponent.control.setValidators(Validators.required);
    hostComponent.control.setValue('');
    hostComponent.control.markAsTouched();
    hostFixture.detectChanges();
    expect(hostComponent.control.errors).toBeTruthy();

    hostComponent.control.updateValueAndValidity();
    tick(0);
    hostFixture.detectChanges();

    expect(hostComponent.control.errors).toBeTruthy();
  }));

  it('should unsubscribe from statusChanges on component destroy', () => {
    const unsubscribeSpy = spyOn(
      inputComponent['statusChangeSubscription'] as any,
      'unsubscribe'
    );
    inputComponent.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
