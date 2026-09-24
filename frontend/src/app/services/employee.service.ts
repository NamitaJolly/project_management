import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, EmployeeSkillMatch } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  create(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  update(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(skills?: string[], minExperience?: number, minCapacity?: number): Observable<EmployeeSkillMatch[]> {
    let params = new HttpParams();
    if (skills && skills.length > 0) {
      params = params.set('skills', skills.join(','));
    }
    if (minExperience !== undefined && minExperience !== null) {
      params = params.set('minExperience', minExperience.toString());
    }
    if (minCapacity !== undefined && minCapacity !== null) {
      params = params.set('minCapacity', minCapacity.toString());
    }
    return this.http.get<EmployeeSkillMatch[]>(`${this.apiUrl}/search`, { params });
  }
}
