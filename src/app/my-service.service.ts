import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Details } from '../interfaces/interface';
import { Observable } from 'rxjs';
import { Environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {

  private myUrl: string = Environment.URI;

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

}
