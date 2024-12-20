import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMLOGINEXTERNOComponent } from './form-login-externo.component';

describe('FORMLOGINEXTERNOComponent', () => {
  let component: FORMLOGINEXTERNOComponent;
  let fixture: ComponentFixture<FORMLOGINEXTERNOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMLOGINEXTERNOComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMLOGINEXTERNOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
