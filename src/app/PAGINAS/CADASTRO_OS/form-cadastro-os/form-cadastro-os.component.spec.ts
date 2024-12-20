import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMCADASTROOSComponent } from './form-cadastro-os.component';

describe('FORMCADASTROOSComponent', () => {
  let component: FORMCADASTROOSComponent;
  let fixture: ComponentFixture<FORMCADASTROOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMCADASTROOSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMCADASTROOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
