import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // ✅ Importa correctamente Router
import { LinkService } from '../../services/link.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-link-detail',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Agregamos FormsModule y CommonModule
  templateUrl: './link-detail.component.html',
})
export class LinkDetailComponent implements OnInit {
  link: any;
  id: string = '';
  newComment: string = '';

  constructor(private route: ActivatedRoute, private linkService: LinkService, private router: Router) {} // ✅ Usamos Router

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadLink();
    });
  }

  loadLink() {
    this.linkService.getLinkById(this.id).subscribe(
      (data) => {
        this.link = data;
      },
      (error) => {
        console.error('Error al cargar el enlace:', error);
      }
    );
  }

  vote(value: number) {
    if (!this.id) return;

    this.linkService.voteLink(this.id, value).subscribe(
      (updatedLink) => {
        this.link.votes = updatedLink.votes;
      },
      (error) => {
        console.error('Error al votar:', error);
      }
    );
  }

  addComment() {
    if (!this.newComment.trim()) return;

    this.linkService.addComment(this.id, this.newComment).subscribe(
      (updatedLink) => {
        this.link.comments = updatedLink.comments;
        this.newComment = ''; // Limpiar el campo después de agregar el comentario
      },
      (error) => {
        console.error('Error al agregar el comentario:', error);
      }
    );
  }

  deleteComment(index: number) {
    this.linkService.deleteComment(this.id, index).subscribe(
      (updatedLink) => {
        this.link.comments = updatedLink.comments;
      },
      (error) => {
        console.error('Error al eliminar el comentario:', error);
      }
    );
  }

  goHome() {
    this.router.navigate(['/']); // ✅ CORREGIDO
  }
}
