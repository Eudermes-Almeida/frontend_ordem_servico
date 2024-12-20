import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMDELETAROSComponent } from './form-deletar-os.component';

describe('FORMDELETAROSComponent', () => {
  let component: FORMDELETAROSComponent;
  let fixture: ComponentFixture<FORMDELETAROSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMDELETAROSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMDELETAROSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
