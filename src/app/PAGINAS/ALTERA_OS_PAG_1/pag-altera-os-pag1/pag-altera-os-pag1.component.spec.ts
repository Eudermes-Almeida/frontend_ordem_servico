import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGALTERAOSPAG1Component } from './pag-altera-os-pag1.component';

describe('PAGALTERAOSPAG1Component', () => {
  let component: PAGALTERAOSPAG1Component;
  let fixture: ComponentFixture<PAGALTERAOSPAG1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGALTERAOSPAG1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGALTERAOSPAG1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
