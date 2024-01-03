import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMuseumComponent } from './list-museum.component';

describe('ListMuseumComponent', () => {
  let component: ListMuseumComponent;
  let fixture: ComponentFixture<ListMuseumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListMuseumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListMuseumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
