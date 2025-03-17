import { TestBed } from '@angular/core/testing';

import { ServiciosEscolaresService } from './servicios-escolares.service';

describe('ServiciosEscolaresService', () => {
  let service: ServiciosEscolaresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosEscolaresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
