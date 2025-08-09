import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeitorPdfPage } from './leitor-pdf.page';

describe('LeitorPdfPage', () => {
  let component: LeitorPdfPage;
  let fixture: ComponentFixture<LeitorPdfPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeitorPdfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
