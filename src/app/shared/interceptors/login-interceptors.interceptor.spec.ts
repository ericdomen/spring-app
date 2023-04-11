import { TestBed } from '@angular/core/testing';

import { LoginInterceptorsInterceptor } from './login-interceptors.interceptor';

describe('LoginInterceptorsInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LoginInterceptorsInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: LoginInterceptorsInterceptor = TestBed.inject(LoginInterceptorsInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
