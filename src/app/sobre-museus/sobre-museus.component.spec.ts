import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreMuseusComponent } from './sobre-museus.component';

describe('SobreMuseusComponent', () => {
  let component: SobreMuseusComponent;
  let fixture: ComponentFixture<SobreMuseusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SobreMuseusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SobreMuseusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
