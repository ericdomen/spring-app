import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoginInterceptorsInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const credentials = btoa('client:secret');

    const httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/x-www-form-urlencoded',
      Authorization: `Basic ${ credentials }`
    });

    const authReq = request.clone({
      headers: httpHeaders
    });

    console.log(authReq.params);

    return next.handle(authReq);
  }
}
