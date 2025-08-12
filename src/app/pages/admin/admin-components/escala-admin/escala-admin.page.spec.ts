import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscalaAdminPage } from './escala-admin.page';

describe('EscalaAdminPage', () => {
  let component: EscalaAdminPage;
  let fixture: ComponentFixture<EscalaAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalaAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
