import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  private API_URL = 'http://localhost:3000/links';

  constructor(private http: HttpClient) {}

  // Obtener todos los enlaces
  getLinks(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  // Obtener un enlace por ID
  getLinkById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  // Crear un nuevo enlace
  createLink(title: string, url: string, tags: string[]): Observable<any> {
    const newLink = { title, url, tags };
    return this.http.post<any>(`${this.API_URL}/links`, newLink);
  }
  

  // Votar un enlace
  voteLink(id: string, value: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/${id}/votes`, { value });
  }

  addComment(id: string, comment: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/comments`, { comment });
  }  
  }
