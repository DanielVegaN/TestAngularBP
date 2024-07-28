import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoComponent } from './logo.component';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load a default image when image url load with error', () => {
    component.logoSrc = 'invalid-url.png';
    fixture.detectChanges();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');

    const errorEvent = new Event('error');
    img.dispatchEvent(errorEvent);

    fixture.detectChanges();
    const getBasename = (path: string) => path.split('/').pop();

    expect(getBasename(img.src)).toBe(getBasename(component.defaultImage));
  });
});
