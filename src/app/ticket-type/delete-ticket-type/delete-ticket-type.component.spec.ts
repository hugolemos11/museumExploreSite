import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTicketTypeComponent } from './delete-ticket-type.component';

describe('DeleteTicketTypeComponent', () => {
  let component: DeleteTicketTypeComponent;
  let fixture: ComponentFixture<DeleteTicketTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTicketTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteTicketTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
