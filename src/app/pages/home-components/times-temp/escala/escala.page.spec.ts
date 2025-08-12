import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscalaPage } from './escala.page';

describe('EscalaPage', () => {
  let component: EscalaPage;
  let fixture: ComponentFixture<EscalaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
