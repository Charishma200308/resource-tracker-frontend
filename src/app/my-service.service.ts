import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Details } from '../interfaces/interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { Environment } from '../environments/environment';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class MyServiceService {

  private myUrl: string = Environment.URI;
  private authUrl: string = Environment.URL;

  constructor(private http: HttpClient) { }

  GetAllEmployees() {
    const endpoint = this.myUrl + 'GetAll'

    return this.http.get(endpoint);
  }

  AddEmployee(data: any) {
    const endpoint = this.myUrl + 'AddEmployee'

    return this.http.post(endpoint, data);
  }

  DeleteEmployee(EmId: number) {
    const endpoint = this.myUrl + EmId

    return this.http.delete(endpoint)
  }

  GetEmployee(EmId: number) {
    const endpoint = this.myUrl + EmId

    return this.http.get(endpoint)
  }

  UpdateEmployee(EmId: number, data: any) {
    const endpoint = this.myUrl + EmId;

    return this.http.put(endpoint, data)
  }

  GetLocation() {
    const endpoint = this.myUrl + "locations";

    return this.http.get(endpoint);
  }

  GetDesignation() {
    const endpoint = this.myUrl + "designations";

    return this.http.get(endpoint);
  }

  GetBillablestatuses() {
    const endpoint = this.myUrl + "billablestatuses";

    return this.http.get(endpoint);
  }

  GetSkills() {
    const endpoint = this.myUrl + 'skills';
    return this.http.get(endpoint);
  }

  GetProjects() {
    const endpoint = this.myUrl + 'projects';
    return this.http.get(endpoint);
  }

  AddSkill(data: any) {
    const endpoint = this.myUrl + 'skills/add';
    return this.http.post(endpoint, data);
  }

  BulkUpdateEmployees(data: any) {
    const endpoint = this.myUrl + 'bulk-update';
    return this.http.put(endpoint, data);
  }

  GetById(id: number[]) {
    const endpoint = this.myUrl + id;
    return this.http.get(endpoint);
  }

  register(data: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(this.authUrl + 'register', data);
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(this.authUrl + 'login', credentials);
  }

  storeToken(token: string) {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  logout() {
    localStorage.removeItem('jwt_token');
  }

  storeUsername(username: string) {
    localStorage.setItem('username', username);
  }


  private usernameSubject = new BehaviorSubject<string | null>(null);

  username$ = this.usernameSubject.asObservable();

  setUsername() {
    const token = this.getToken();
    if (!token) {
      this.usernameSubject.next(null);
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      const username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || null;
      this.usernameSubject.next(username);
    } catch {
      this.usernameSubject.next(null);
    }
  }

  getUsername(): string | null {
  return this.usernameSubject.value;
}

}
