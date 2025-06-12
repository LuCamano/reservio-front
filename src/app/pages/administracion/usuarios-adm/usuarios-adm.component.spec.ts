import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosAdmComponent } from './usuarios-adm.component';

describe('UsuariosAdmComponent', () => {
  let component: UsuariosAdmComponent;
  let fixture: ComponentFixture<UsuariosAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsuariosAdmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
