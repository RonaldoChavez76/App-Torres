import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteInfoComponent } from './estudiante-info.component';

describe('EstudianteInfoComponent', () => {
  let component: EstudianteInfoComponent;
  let fixture: ComponentFixture<EstudianteInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
