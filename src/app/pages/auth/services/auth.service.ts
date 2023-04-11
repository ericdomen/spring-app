import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { AuthResponse } from 'src/app/shared/models/auth.interface';
import { environment } from 'src/environments/environment.development';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = new BehaviorSubject<string>("");
  private tokenData = new BehaviorSubject<any>({});

  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private http: HttpClient) {
                this.checkToken();
              }

  get token$(): Observable<string> {
    return this.token.asObservable();
  }

  get tokenData$(): Observable<any> {
    return this.tokenData.asObservable();
  }

  login(loginData: any): Observable<AuthResponse | void> {
    loginData.grant_type = "client_credentials";

    let params: URLSearchParams = new URLSearchParams();
    params.set("grant_type", loginData.grant_type);
    params.set("username", loginData.username);
    params.set("password", loginData.password);

    console.log(params.toString());

    return this.http.post<AuthResponse>(`${ environment.API_URL }/oauth2/token`, params.toString())
      .pipe(map( (data: AuthResponse) => {
        console.log(data);
        /*if (data.token) {
          this.saveLocalStorage(data.token);
          this.token.next(data.token);
          this.router.navigate(['/home']);
  
          this.checkToken();
        }*/

        return data;
      }),
      catchError( (error) => this.handlerError(error)));
  }

  saveLocalStorage(token: string) {
    localStorage.setItem("token", token);
  }

  logout() {
    localStorage.removeItem("token");
    this.token.next("");
    this.tokenData.next(null);
    this.router.navigate(['/']);
  }

  checkToken() {
    const token = localStorage.getItem("token");
    if (token) {
      const isExpired = helper.isTokenExpired(token);
      if (isExpired) {
        this.logout();
      } else {
        this.token.next(token);

        // renovar los datos del perfil
        const { iat, exp, ...data } = helper.decodeToken(token);
        this.tokenData.next(data);
      }
    } else {
      this.logout();
    }
  }

  handlerError(error: any): Observable<never> {
    console.log(error);
    var errorMessage = "Ocurrió un error";
    if (error.error) {
      errorMessage = `Error: ${ error.error.mensaje }`;
    }

    this.snackBar.open(errorMessage, '', {
      duration: 5 * 1000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });

    return throwError(() => new Error(errorMessage));
  }
}
