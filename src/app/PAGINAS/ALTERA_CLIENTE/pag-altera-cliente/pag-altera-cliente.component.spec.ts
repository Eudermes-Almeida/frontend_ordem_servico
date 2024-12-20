import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PAGALTERACLIENTEComponent } from './pag-altera-cliente.component';

describe('PAGALTERACLIENTEComponent', () => {
  let component: PAGALTERACLIENTEComponent;
  let fixture: ComponentFixture<PAGALTERACLIENTEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PAGALTERACLIENTEComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PAGALTERACLIENTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
