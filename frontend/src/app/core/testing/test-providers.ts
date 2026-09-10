import { of } from 'rxjs';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

//Shared providers for the component/service specs: most app services inject
//HttpClient and Router, so a bare TestBed.configureTestingModule({}) fails with
//NullInjectorError. The .spec.ts suffix keeps this file out of the app build.
export const testProviders = [provideRouter([]), provideHttpClient()];

//Minimal ActivatedRoute stub for components that inject it directly
export const activatedRouteStub: Partial<ActivatedRoute> = {
  snapshot: {
    data: {},
    params: {},
    queryParams: {},
  } as any,
  paramMap: of(convertToParamMap({})),
  queryParamMap: of(convertToParamMap({})),
};
