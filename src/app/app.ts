import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { PostService, Post } from './services/post.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  posts = signal<Post[]>([]);
  newPost: Post = { title: '', content: '' };

  editMode = false;
  postToEdit: Post | null = null;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.cargarPosts();
  }

  cargarPosts() {
    this.postService.getPosts().subscribe({
      next: (data: Post[]) => this.posts.set(data),
      error: (err: any) => console.error('Error al cargar posts:', err)
    });
  }

  guardar() {
    const datos: Post = {
      title: this.newPost.title.trim(),
      content: this.newPost.content.trim()
    };

    if (!datos.title || !datos.content) {
      alert('Completa título y contenido');
      return;
    }

    if (this.editMode && this.postToEdit?._id) {
      // PUT - Actualizar
      this.postService.updatePost(this.postToEdit._id, datos).subscribe({
        next: () => {
          this.cargarPosts();
          this.cancelar();
        },
        error: (err: any) => console.error('Error al actualizar (PUT):', err)
      });
    } else {
      // POST - Crear
      this.postService.createPost(datos).subscribe({
        next: () => {
          this.cargarPosts();
          this.newPost = { title: '', content: '' };
        },
        error: (err: any) => console.error('Error al crear (POST):', err)
      });
    }
  }

  editar(post: Post) {
    this.editMode = true;
    this.postToEdit = { ...post };
    this.newPost = { title: post.title, content: post.content };
  }

  cancelar() {
    this.editMode = false;
    this.postToEdit = null;
    this.newPost = { title: '', content: '' };
  }

  eliminar(id?: string) {
    if (!id) return;
    if (!confirm('¿Realmente quieres eliminar este registro?')) return;

    this.postService.deletePost(id).subscribe({
      next: () => this.cargarPosts(),
      error: (err: any) => console.error('Error al eliminar (DELETE):', err)
    });
  }
}