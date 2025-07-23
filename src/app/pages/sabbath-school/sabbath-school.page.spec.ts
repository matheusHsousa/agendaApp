import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SabbathSchoolPage } from './sabbath-school.page';

describe('SabbathSchoolPage', () => {
  let component: SabbathSchoolPage;
  let fixture: ComponentFixture<SabbathSchoolPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SabbathSchoolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
