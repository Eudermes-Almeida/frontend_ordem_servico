import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMCONSULTAOSComponent } from './form-consulta-os.component';

describe('FORMCONSULTAOSComponent', () => {
  let component: FORMCONSULTAOSComponent;
  let fixture: ComponentFixture<FORMCONSULTAOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMCONSULTAOSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMCONSULTAOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
