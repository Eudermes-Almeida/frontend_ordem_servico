import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMALTERACLIENTEComponent } from './form-altera-cliente.component';

describe('FORMALTERACLIENTEComponent', () => {
  let component: FORMALTERACLIENTEComponent;
  let fixture: ComponentFixture<FORMALTERACLIENTEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMALTERACLIENTEComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMALTERACLIENTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
