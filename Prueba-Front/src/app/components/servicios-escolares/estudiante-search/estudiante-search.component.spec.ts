import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteSearchComponent } from './estudiante-search.component';

describe('EstudianteSearchComponent', () => {
  let component: EstudianteSearchComponent;
  let fixture: ComponentFixture<EstudianteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
