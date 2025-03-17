import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarObservacionComponent } from './consultar-observacion.component';

describe('ConsultarObservacionComponent', () => {
  let component: ConsultarObservacionComponent;
  let fixture: ComponentFixture<ConsultarObservacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultarObservacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarObservacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
