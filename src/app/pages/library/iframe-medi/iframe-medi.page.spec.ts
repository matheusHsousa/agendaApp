import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IframeMediPage } from './iframe-medi.page';

describe('IframeMediPage', () => {
  let component: IframeMediPage;
  let fixture: ComponentFixture<IframeMediPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeMediPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
