import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddimagesMuseumComponent } from './addimages-museum.component';

describe('AddimagesMuseumComponent', () => {
  let component: AddimagesMuseumComponent;
  let fixture: ComponentFixture<AddimagesMuseumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddimagesMuseumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddimagesMuseumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
