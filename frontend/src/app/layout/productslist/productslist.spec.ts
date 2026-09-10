import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { activatedRouteStub, testProviders } from '../../core/testing/test-providers';
import { Productslist } from './productslist';

describe('Productslist', () => {
  let component: Productslist;
  let fixture: ComponentFixture<Productslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productslist],
      providers: [
        ...testProviders,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Productslist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
