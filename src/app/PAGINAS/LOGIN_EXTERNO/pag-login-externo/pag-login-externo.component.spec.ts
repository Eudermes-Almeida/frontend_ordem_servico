import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGLOGINEXTERNOComponent } from './pag-login-externo.component';

describe('PAGLOGINEXTERNOComponent', () => {
  let component: PAGLOGINEXTERNOComponent;
  let fixture: ComponentFixture<PAGLOGINEXTERNOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGLOGINEXTERNOComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGLOGINEXTERNOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
