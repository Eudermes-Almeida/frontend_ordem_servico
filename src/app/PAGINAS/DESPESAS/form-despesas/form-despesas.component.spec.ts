import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDespesasComponent } from './form-despesas.component';

describe('FormDespesasComponent', () => {
  let component: FormDespesasComponent;
  let fixture: ComponentFixture<FormDespesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDespesasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDespesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
