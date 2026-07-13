import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminComponent } from './superadmin';

describe('Superadmin', () => {
  let component: SuperadminComponent;
  let fixture: ComponentFixture<SuperadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
