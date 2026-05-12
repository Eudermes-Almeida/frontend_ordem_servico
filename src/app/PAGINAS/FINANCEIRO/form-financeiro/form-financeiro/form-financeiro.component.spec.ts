import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFinanceiroComponent } from './form-financeiro.component';

describe('FormFinanceiroComponent', () => {
  let component: FormFinanceiroComponent;
  let fixture: ComponentFixture<FormFinanceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFinanceiroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
