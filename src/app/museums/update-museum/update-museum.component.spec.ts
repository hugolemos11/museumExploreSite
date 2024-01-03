import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMuseumComponent } from './update-museum.component';

describe('UpdateMuseumComponent', () => {
  let component: UpdateMuseumComponent;
  let fixture: ComponentFixture<UpdateMuseumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateMuseumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateMuseumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
