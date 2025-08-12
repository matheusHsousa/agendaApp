import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BibliaPage } from './biblia.page';

describe('BibliaPage', () => {
  let component: BibliaPage;
  let fixture: ComponentFixture<BibliaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
