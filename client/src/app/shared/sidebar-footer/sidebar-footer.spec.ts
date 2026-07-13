import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFooterComponent } from './sidebar-footer';

describe('SidebarFooterComponent', () => {
  let component: SidebarFooterComponent;
  let fixture: ComponentFixture<SidebarFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarFooterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
