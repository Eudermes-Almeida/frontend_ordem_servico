import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormconsultaclienteComponent } from './formconsultacliente.component';

describe('FormconsultaclienteComponent', () => {
  let component: FormconsultaclienteComponent;
  let fixture: ComponentFixture<FormconsultaclienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormconsultaclienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormconsultaclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
