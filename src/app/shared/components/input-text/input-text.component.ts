import { Component, Input, Self } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'shared-input-text',
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css',
})
export class InputTextComponent {
  @Input() label: string = '';
  @Input() type: string = 'text';

  private statusChangeSubscription: Subscription | null = null;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  ngOnInit() {
    this.statusChangeSubscription = this.control.statusChanges
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        if (this.control.disabled) {
          this.control.setErrors(null);
        }
      });
  }

  ngOnDestroy() {
    if (this.statusChangeSubscription) {
      this.statusChangeSubscription.unsubscribe();
    }
  }

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  get isDisabled(): boolean {
    return this.control.disabled;
  }
}
