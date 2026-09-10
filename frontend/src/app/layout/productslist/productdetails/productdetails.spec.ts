import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { activatedRouteStub, testProviders } from '../../../core/testing/test-providers';
import { Productdetails } from './productdetails';

describe('Productdetails', () => {
  let component: Productdetails;
  let fixture: ComponentFixture<Productdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productdetails],
      providers: [
        ...testProviders,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Productdetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
