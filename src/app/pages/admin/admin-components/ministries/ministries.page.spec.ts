import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinistriesPage } from './ministries.page';

describe('MinistriesPage', () => {
  let component: MinistriesPage;
  let fixture: ComponentFixture<MinistriesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
