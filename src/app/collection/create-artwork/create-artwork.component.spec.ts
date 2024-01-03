import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArtworkComponent } from './create-artwork.component';

describe('CreateArtworkComponent', () => {
  let component: CreateArtworkComponent;
  let fixture: ComponentFixture<CreateArtworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateArtworkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateArtworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
