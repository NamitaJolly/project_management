import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssignmentRequest, ProjectAssignment } from '../models/assignment.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private apiUrl = 'http://localhost:8080/api/assignments';

  constructor(private http: HttpClient) {}

  getAll(projectId?: number, employeeId?: number): Observable<ProjectAssignment[]> {
    let params = new HttpParams();
    if (projectId) {
      params = params.set('projectId', projectId.toString());
    }
    if (employeeId) {
      params = params.set('employeeId', employeeId.toString());
    }
    return this.http.get<ProjectAssignment[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ProjectAssignment> {
    return this.http.get<ProjectAssignment>(`${this.apiUrl}/${id}`);
  }

  assign(request: AssignmentRequest): Observable<ProjectAssignment> {
    return this.http.post<ProjectAssignment>(this.apiUrl, request);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
