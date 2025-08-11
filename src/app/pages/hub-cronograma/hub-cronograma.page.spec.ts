import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubCronogramaPage } from './hub-cronograma.page';

describe('HubCronogramaPage', () => {
  let component: HubCronogramaPage;
  let fixture: ComponentFixture<HubCronogramaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HubCronogramaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
