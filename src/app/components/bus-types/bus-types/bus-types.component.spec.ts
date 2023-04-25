import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusTypesComponent } from './bus-types.component';

describe('BusTypesComponent', () => {
  let component: BusTypesComponent;
  let fixture: ComponentFixture<BusTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
