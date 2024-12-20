import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMALTERAOSPAG2Component } from './form-altera-os-pag2.component';

describe('FORMALTERAOSPAG2Component', () => {
  let component: FORMALTERAOSPAG2Component;
  let fixture: ComponentFixture<FORMALTERAOSPAG2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMALTERAOSPAG2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMALTERAOSPAG2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
