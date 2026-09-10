import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mysignal } from './mysignal';

describe('Mysignal', () => {
  let component: Mysignal;
  let fixture: ComponentFixture<Mysignal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mysignal],
    }).compileComponents();

    fixture = TestBed.createComponent(Mysignal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
