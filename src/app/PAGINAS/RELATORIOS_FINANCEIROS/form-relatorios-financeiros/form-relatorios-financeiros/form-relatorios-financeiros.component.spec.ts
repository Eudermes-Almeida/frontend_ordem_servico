import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRelatoriosFinanceirosComponent } from './form-relatorios-financeiros.component';

describe('FormRelatoriosFinanceirosComponent', () => {
  let component: FormRelatoriosFinanceirosComponent;
  let fixture: ComponentFixture<FormRelatoriosFinanceirosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRelatoriosFinanceirosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormRelatoriosFinanceirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
