import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMIMPRIMEOSLOTEComponent } from './form-imprime-os-lote.component';

describe('FORMIMPRIMEOSLOTEComponent', () => {
  let component: FORMIMPRIMEOSLOTEComponent;
  let fixture: ComponentFixture<FORMIMPRIMEOSLOTEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMIMPRIMEOSLOTEComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMIMPRIMEOSLOTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
