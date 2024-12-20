import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGRELATORIOSComponent } from './pag-relatorios.component';

describe('PAGRELATORIOSComponent', () => {
  let component: PAGRELATORIOSComponent;
  let fixture: ComponentFixture<PAGRELATORIOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGRELATORIOSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGRELATORIOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
