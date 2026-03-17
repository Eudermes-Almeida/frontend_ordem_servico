import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaAnaliseFaturamentoComponent } from './pagina-analise-faturamento.component';

describe('PaginaAnaliseFaturamentoComponent', () => {
  let component: PaginaAnaliseFaturamentoComponent;
  let fixture: ComponentFixture<PaginaAnaliseFaturamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaAnaliseFaturamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaginaAnaliseFaturamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
