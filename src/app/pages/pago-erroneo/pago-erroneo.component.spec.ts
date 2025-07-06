import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoErroneoComponent } from './pago-erroneo.component';

describe('PagoErroneoComponent', () => {
  let component: PagoErroneoComponent;
  let fixture: ComponentFixture<PagoErroneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagoErroneoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoErroneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
