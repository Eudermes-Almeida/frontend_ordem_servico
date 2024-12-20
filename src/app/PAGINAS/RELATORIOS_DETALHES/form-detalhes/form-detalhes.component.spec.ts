import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMDETALHESComponent } from './form-detalhes.component';

describe('FORMDETALHESComponent', () => {
  let component: FORMDETALHESComponent;
  let fixture: ComponentFixture<FORMDETALHESComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMDETALHESComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMDETALHESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
