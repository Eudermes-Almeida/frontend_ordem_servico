import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMALTERAOSPAG1Component } from './form-altera-os-pag1.component';

describe('FORMALTERAOSPAG1Component', () => {
  let component: FORMALTERAOSPAG1Component;
  let fixture: ComponentFixture<FORMALTERAOSPAG1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMALTERAOSPAG1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMALTERAOSPAG1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
