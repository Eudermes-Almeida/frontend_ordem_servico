import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TIMELINEComponent } from './timeline.component';

describe('TIMELINEComponent', () => {
  let component: TIMELINEComponent;
  let fixture: ComponentFixture<TIMELINEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TIMELINEComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TIMELINEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
