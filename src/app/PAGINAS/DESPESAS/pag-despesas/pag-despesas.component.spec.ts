import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagDespesasComponent } from './pag-despesas.component';

describe('PagDespesasComponent', () => {
  let component: PagDespesasComponent;
  let fixture: ComponentFixture<PagDespesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagDespesasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagDespesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
