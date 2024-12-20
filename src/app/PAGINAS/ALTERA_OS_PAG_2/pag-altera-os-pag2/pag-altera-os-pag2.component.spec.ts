import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGALTERAOSPAG2Component } from './pag-altera-os-pag2.component';

describe('PAGALTERAOSPAG2Component', () => {
  let component: PAGALTERAOSPAG2Component;
  let fixture: ComponentFixture<PAGALTERAOSPAG2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGALTERAOSPAG2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGALTERAOSPAG2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
