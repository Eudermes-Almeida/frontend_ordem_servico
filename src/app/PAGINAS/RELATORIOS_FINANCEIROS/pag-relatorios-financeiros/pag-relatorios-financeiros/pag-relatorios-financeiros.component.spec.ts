import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagRelatoriosFinanceirosComponent } from './pag-relatorios-financeiros.component';

describe('PagRelatoriosFinanceirosComponent', () => {
  let component: PagRelatoriosFinanceirosComponent;
  let fixture: ComponentFixture<PagRelatoriosFinanceirosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagRelatoriosFinanceirosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagRelatoriosFinanceirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
