import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMRELATORIOSComponent } from './form-relatorios.component';

describe('FORMRELATORIOSComponent', () => {
  let component: FORMRELATORIOSComponent;
  let fixture: ComponentFixture<FORMRELATORIOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMRELATORIOSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMRELATORIOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
