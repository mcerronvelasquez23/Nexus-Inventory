import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminVentas } from './superadmin-ventas';

describe('SuperadminVentas', () => {
  let component: SuperadminVentas;
  let fixture: ComponentFixture<SuperadminVentas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminVentas],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminVentas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
