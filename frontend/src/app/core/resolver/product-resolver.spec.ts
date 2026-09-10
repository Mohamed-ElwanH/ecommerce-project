import { TestBed } from '@angular/core/testing';
import { testProviders } from '../testing/test-providers';
import { ProductResolver } from './product-resolver';

describe('ProductResolver', () => {
  let service: ProductResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...testProviders],
    });
    service = TestBed.inject(ProductResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
