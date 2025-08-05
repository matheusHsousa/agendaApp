import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeditacoesPage } from './meditacoes.page';

describe('MeditacoesPage', () => {
  let component: MeditacoesPage;
  let fixture: ComponentFixture<MeditacoesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeditacoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
