import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMuseumComponent } from './create-museum.component';

describe('CreateMuseumComponent', () => {
  let component: CreateMuseumComponent;
  let fixture: ComponentFixture<CreateMuseumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateMuseumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateMuseumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
