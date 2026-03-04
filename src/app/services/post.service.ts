import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Exportamos la interfaz para que se pueda importar { Post }
export interface Post {
  _id?: string;
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root'          // Esto lo hace inyectable globalmente
})
export class PostService {    // ← export class (obligatorio)

  private apiUrl = 'https://crudcrud.com/api/c14bd53b9c674faf920e1d0772d275a1/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  updatePost(id: string, post: Post): Observable<any> {
    // PUT: url + '/' + id + body (como dice la guía)
    return this.http.put(`${this.apiUrl}/${id}`, post);
  }

  deletePost(id: string): Observable<any> {
    // DELETE: solo url + '/' + id (como dice la guía)
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}