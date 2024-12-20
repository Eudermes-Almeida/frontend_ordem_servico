import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMLOGINLISTAComponent } from './form-login-lista.component';

describe('FORMLOGINLISTAComponent', () => {
  let component: FORMLOGINLISTAComponent;
  let fixture: ComponentFixture<FORMLOGINLISTAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMLOGINLISTAComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMLOGINLISTAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
