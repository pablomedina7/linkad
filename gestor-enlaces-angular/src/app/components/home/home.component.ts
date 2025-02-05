import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LinkService } from '../../services/link.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule], // 📌 Importar CommonModule y FormsModule
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  links: any[] = [];
  filter: string = ''; // 🏷️ Filtro en tiempo real
  newTitle: string = '';
  newUrl: string = '';
  newTags: string = '';
  error: string = '';

  constructor(private linkService: LinkService, private router: Router) {}

  ngOnInit() {
    this.loadLinks();
  }

  loadLinks() {
    this.linkService.getLinks().subscribe(
      (data) => {
        this.links = data;
      },
      (error) => {
        this.error = 'Error cargando enlaces';
      }
    );
  }

  addLink() {
    if (!this.newTitle || !this.newUrl) return;

    const tagsArray = this.newTags ? this.newTags.split(',').map(tag => tag.trim()) : [];

    this.linkService.createLink(this.newTitle, this.newUrl, tagsArray).subscribe(
      (data) => {
        this.links.push(data);
        this.newTitle = '';
        this.newUrl = '';
        this.newTags = '';
      },
      (error) => {
        this.error = 'Error al agregar el enlace';
      }
    );
  }

  navigateToDetail(id: string) {
    this.router.navigate([`/link/${id}`]);
  }

  // ✅ Función para filtrar enlaces en tiempo real
  filteredLinks() {
    if (!this.filter) {
      return this.links;
    }
    return this.links.filter(link =>
      link.tags?.some((tag: string) => tag.toLowerCase().includes(this.filter.toLowerCase()))
    );
  }
}  
