import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGDETALHESComponent } from './pag-detalhes.component';

describe('PAGDETALHESComponent', () => {
  let component: PAGDETALHESComponent;
  let fixture: ComponentFixture<PAGDETALHESComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGDETALHESComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGDETALHESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
