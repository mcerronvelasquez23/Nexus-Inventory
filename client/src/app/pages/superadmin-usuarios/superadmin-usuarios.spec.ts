import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminUsuarios } from './superadmin-usuarios';

describe('SuperadminUsuarios', () => {
  let component: SuperadminUsuarios;
  let fixture: ComponentFixture<SuperadminUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminUsuarios],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminUsuarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
