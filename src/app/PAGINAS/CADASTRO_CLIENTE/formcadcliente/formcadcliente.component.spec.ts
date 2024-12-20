import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormcadclienteComponent } from './formcadcliente.component';

describe('FormcadclienteComponent', () => {
  let component: FormcadclienteComponent;
  let fixture: ComponentFixture<FormcadclienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormcadclienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormcadclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
