import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagconsultaclienteComponent } from './pagconsultacliente.component';

describe('PagconsultaclienteComponent', () => {
  let component: PagconsultaclienteComponent;
  let fixture: ComponentFixture<PagconsultaclienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagconsultaclienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagconsultaclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
