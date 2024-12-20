import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGLOGINLISTAComponent } from './pag-login-lista.component';

describe('PAGLOGINLISTAComponent', () => {
  let component: PAGLOGINLISTAComponent;
  let fixture: ComponentFixture<PAGLOGINLISTAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGLOGINLISTAComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGLOGINLISTAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
