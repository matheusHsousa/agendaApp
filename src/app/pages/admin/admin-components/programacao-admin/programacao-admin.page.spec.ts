import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramacaoAdminPage } from './programacao-admin.page';

describe('ProgramacaoAdminPage', () => {
  let component: ProgramacaoAdminPage;
  let fixture: ComponentFixture<ProgramacaoAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramacaoAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
