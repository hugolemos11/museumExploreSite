import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddimagesArtworkComponent } from './addimages-artwork.component';

describe('AddimagesArtworkComponent', () => {
  let component: AddimagesArtworkComponent;
  let fixture: ComponentFixture<AddimagesArtworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddimagesArtworkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddimagesArtworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
