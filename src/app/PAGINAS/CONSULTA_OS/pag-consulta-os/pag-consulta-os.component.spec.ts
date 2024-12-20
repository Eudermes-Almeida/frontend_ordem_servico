import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGCONSULTAOSComponent } from './pag-consulta-os.component';

describe('PAGCONSULTAOSComponent', () => {
  let component: PAGCONSULTAOSComponent;
  let fixture: ComponentFixture<PAGCONSULTAOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGCONSULTAOSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGCONSULTAOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
