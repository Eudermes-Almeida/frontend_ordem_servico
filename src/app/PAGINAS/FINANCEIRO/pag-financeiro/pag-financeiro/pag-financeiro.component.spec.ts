import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagFinanceiroComponent } from './pag-financeiro.component';

describe('PagFinanceiroComponent', () => {
  let component: PagFinanceiroComponent;
  let fixture: ComponentFixture<PagFinanceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagFinanceiroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
