import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteRegistrarComponent } from './estudiante-registrar.component';

describe('EstudianteRegistrarComponent', () => {
  let component: EstudianteRegistrarComponent;
  let fixture: ComponentFixture<EstudianteRegistrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteRegistrarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteRegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
