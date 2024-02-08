import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTicketTypeComponent } from './update-ticket-type.component';

describe('UpdateTicketTypeComponent', () => {
  let component: UpdateTicketTypeComponent;
  let fixture: ComponentFixture<UpdateTicketTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateTicketTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateTicketTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
