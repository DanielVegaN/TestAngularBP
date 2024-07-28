import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.css',
})
export class LogoComponent {
  @Input()
  public logoSrc: string = '';

  defaultImage: string = './assets/product.png';
  onImageError(event: Event): void {
    event.preventDefault();
    const element = event.target as HTMLImageElement;
    element.src = this.defaultImage;
  }
}
