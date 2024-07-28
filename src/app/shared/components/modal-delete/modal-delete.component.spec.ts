import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDeleteComponent } from './modal-delete.component';

describe('ModalDeleteComponent', () => {
  let component: ModalDeleteComponent;
  let fixture: ComponentFixture<ModalDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirm event and set isVisible to false when confirmDeletion is called', () => {
    spyOn(component.confirm, 'emit');
    component.isVisible = true;
    component.confirmDeletion();
    expect(component.confirm.emit).toHaveBeenCalled();
    expect(component.isVisible).toBeFalse();
  });

  it('should emit cancel event and set isVisible to false when closeModal is called', () => {
    spyOn(component.cancel, 'emit');
    component.isVisible = true;
    component.closeModal();
    expect(component.cancel.emit).toHaveBeenCalled();
    expect(component.isVisible).toBeFalse();
  });
});
