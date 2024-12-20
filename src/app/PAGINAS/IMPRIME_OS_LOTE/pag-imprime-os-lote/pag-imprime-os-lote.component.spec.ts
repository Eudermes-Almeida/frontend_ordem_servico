import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGIMPRIMEOSLOTEComponent } from './pag-imprime-os-lote.component';

describe('PAGIMPRIMEOSLOTEComponent', () => {
  let component: PAGIMPRIMEOSLOTEComponent;
  let fixture: ComponentFixture<PAGIMPRIMEOSLOTEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGIMPRIMEOSLOTEComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGIMPRIMEOSLOTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
