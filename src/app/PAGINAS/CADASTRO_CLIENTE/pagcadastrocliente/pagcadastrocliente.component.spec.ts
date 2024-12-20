import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagcadastroclienteComponent } from './pagcadastrocliente.component';

describe('PagcadastroclienteComponent', () => {
  let component: PagcadastroclienteComponent;
  let fixture: ComponentFixture<PagcadastroclienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagcadastroclienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagcadastroclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
