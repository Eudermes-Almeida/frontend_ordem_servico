import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioAnaliseDespesaComponent } from './formulario-analise-despesa.component';

describe('FormularioAnaliseDespesaComponent', () => {
  let component: FormularioAnaliseDespesaComponent;
  let fixture: ComponentFixture<FormularioAnaliseDespesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioAnaliseDespesaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioAnaliseDespesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
