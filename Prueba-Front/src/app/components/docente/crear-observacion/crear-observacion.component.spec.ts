import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearObservacionComponent } from './crear-observacion.component';

describe('CrearObservacionComponent', () => {
  let component: CrearObservacionComponent;
  let fixture: ComponentFixture<CrearObservacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearObservacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearObservacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
