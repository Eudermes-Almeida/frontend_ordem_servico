import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGPARAMETROSComponent } from './pag-parametros.component';

describe('PAGPARAMETROSComponent', () => {
  let component: PAGPARAMETROSComponent;
  let fixture: ComponentFixture<PAGPARAMETROSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGPARAMETROSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGPARAMETROSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
