import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movie-api-007.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

  // Making the api call to the user registration endpoint
  public registerUser(userDetails: any): Observable<any> {
    return this.post('users', userDetails, false);
  }

  // Making the api call to the user login endpoint
  public login(userDetails: any): Observable<any> {
    return this.post('login?Username=' + userDetails.Username + '&Password=' + userDetails.Password, {}, false);
  }
  /**
   * @returns Array - List of all movies
   */
  public getAllMovies(): Observable<any> {
    return this.get('movies');
  }
  /**
   * @param title: String
   * @returns Object - data about single movie
   */
  public getMovie(title: string): Observable<any> {
    return this.get('movies/' + title);
  }
  /**
   * @param name: String
   * @returns Object - data about genre
   */
  public getGenre(name: string): Observable<any> {
    return this.get('movies/genres/' + name);
  }
  /**
   * @param name: String
   * @returns Object - data about director
   */
  public getDirector(name: string): Observable<any> {
    return this.get('movies/director/' + name);
  }
  /**
   * @returns Array - list of all users
   */
  public getAllUsers(): Observable<any> {
    return this.get('movies/users');
  }
  /**
   * @param usrname: String
   * @returns Object - data about single user
   */
  public getUser(username: string): Observable<any> {
    return this.get('users/' + username);
  }

  public updateUser(username: string, userDetails: any): Observable<any> {
    return this.put('users/' + username, userDetails);
  }

  public deleteUser(username: string): Observable<any> {
    return this.delete('movies/users/' + username);
  }

  /**
   * @param username String
   * @param movieId String
   * @returns Array - updated list of favorite movies of the user
   */
  public addToFavorites(username: string, movieId: string) {
    return this.post('users/' + username + '/favorites/' + movieId, {}, true);
  }

  public removeFromFavorites(username: string, movieId: string) {
    return this.delete('users/' + username + '/favorites/' + movieId);
  }

  private get(path: string) {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + path, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private post(path: string, body: any, authenticate: boolean) {
    var header = {};
    if (authenticate) {
      const token = localStorage.getItem('token');
      header = {
        headers: new HttpHeaders(
          {
            Authorization: 'Bearer ' + token,
          })
      };
    }
    return this.http.post(apiUrl + path, body, header).pipe(
      catchError(this.handleError)
    );
  }

  private put(path: string, body: any) {
    const token = localStorage.getItem('token');
    console.log(body);
    return this.http.put(apiUrl + path, body, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      catchError(this.handleError)
    );
  }

  private delete(path: string) {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + path, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: Response | Object): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}


