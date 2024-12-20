import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGDELETAROSComponent } from './pag-deletar-os.component';

describe('PAGDELETAROSComponent', () => {
  let component: PAGDELETAROSComponent;
  let fixture: ComponentFixture<PAGDELETAROSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGDELETAROSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGDELETAROSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
