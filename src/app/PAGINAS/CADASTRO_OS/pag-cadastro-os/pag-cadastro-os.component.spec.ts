import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGCADASTROOSComponent } from './pag-cadastro-os.component';

describe('PAGCADASTROOSComponent', () => {
  let component: PAGCADASTROOSComponent;
  let fixture: ComponentFixture<PAGCADASTROOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGCADASTROOSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGCADASTROOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
