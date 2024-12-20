import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGORCAMENTOComponent } from './pag-orcamento.component';

describe('PAGORCAMENTOComponent', () => {
  let component: PAGORCAMENTOComponent;
  let fixture: ComponentFixture<PAGORCAMENTOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGORCAMENTOComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGORCAMENTOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
