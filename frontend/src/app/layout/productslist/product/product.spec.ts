import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from '../../../core/testing/test-providers';

import { Product } from './product';
describe('Product', () => {
  let component: Product;
  let fixture: ComponentFixture<Product>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Product],
      providers: [...testProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(Product);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
