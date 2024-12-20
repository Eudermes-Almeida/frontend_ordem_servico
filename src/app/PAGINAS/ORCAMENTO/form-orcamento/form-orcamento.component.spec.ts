import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FORMORCAMENTOComponent } from './form-orcamento.component';

describe('FORMORCAMENTOComponent', () => {
  let component: FORMORCAMENTOComponent;
  let fixture: ComponentFixture<FORMORCAMENTOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FORMORCAMENTOComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FORMORCAMENTOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
