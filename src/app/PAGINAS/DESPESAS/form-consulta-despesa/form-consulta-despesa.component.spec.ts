import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConsultaDespesaComponent } from './form-consulta-despesa.component';

describe('FormConsultaDespesaComponent', () => {
  let component: FormConsultaDespesaComponent;
  let fixture: ComponentFixture<FormConsultaDespesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConsultaDespesaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormConsultaDespesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
