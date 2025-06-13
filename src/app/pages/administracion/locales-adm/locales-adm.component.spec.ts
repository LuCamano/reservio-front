import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalesAdmComponent } from './locales-adm.component';

describe('LocalesAdmComponent', () => {
  let component: LocalesAdmComponent;
  let fixture: ComponentFixture<LocalesAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocalesAdmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalesAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
