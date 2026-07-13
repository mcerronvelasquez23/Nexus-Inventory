import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminHistorial } from './superadmin-historial';

describe('SuperadminHistorial', () => {
  let component: SuperadminHistorial;
  let fixture: ComponentFixture<SuperadminHistorial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminHistorial],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminHistorial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
