import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGLOTECADOSComponent } from './pag-lote-cad-os.component';

describe('PAGLOTECADOSComponent', () => {
  let component: PAGLOTECADOSComponent;
  let fixture: ComponentFixture<PAGLOTECADOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGLOTECADOSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGLOTECADOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
