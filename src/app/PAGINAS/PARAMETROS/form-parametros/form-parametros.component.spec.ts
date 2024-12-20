import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMPARAMETROSComponent } from './form-parametros.component';

describe('FORMPARAMETROSComponent', () => {
  let component: FORMPARAMETROSComponent;
  let fixture: ComponentFixture<FORMPARAMETROSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMPARAMETROSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMPARAMETROSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
