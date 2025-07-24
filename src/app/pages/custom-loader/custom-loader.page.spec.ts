import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomLoaderPage } from './custom-loader.page';

describe('CustomLoaderPage', () => {
  let component: CustomLoaderPage;
  let fixture: ComponentFixture<CustomLoaderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomLoaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
