import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteSearchComponent } from './docente-search.component';

describe('DocenteSearchComponent', () => {
  let component: DocenteSearchComponent;
  let fixture: ComponentFixture<DocenteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocenteSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
