import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateArtworkComponent } from './update-artwork.component';

describe('UpdateArtworkComponent', () => {
  let component: UpdateArtworkComponent;
  let fixture: ComponentFixture<UpdateArtworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateArtworkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateArtworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
