import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../financial-products/interfaces/product';

@Component({
  selector: 'shared-delete-modal',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css'],
})
export class ModalDeleteComponent {
  @Input() isVisible = false;
  @Input() product: Product | null = null;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  confirmDeletion() {
    this.confirm.emit();
    this.isVisible = false;
  }

  closeModal() {
    this.cancel.emit();
    this.isVisible = false;
  }
}
