import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMCADOSComponent } from './form-cad-os.component';

describe('FORMCADOSComponent', () => {
  let component: FORMCADOSComponent;
  let fixture: ComponentFixture<FORMCADOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMCADOSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMCADOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
