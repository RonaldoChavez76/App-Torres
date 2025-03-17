import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteEditarComponent } from './estudiante-editar.component';

describe('EstudianteEditarComponent', () => {
  let component: EstudianteEditarComponent;
  let fixture: ComponentFixture<EstudianteEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
