import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ImageService } from '../services/image.service';

@Component({
    selector: 'app-image',
    standalone: true,
    imports: [CommonModule, MatToolbarModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule, MatProgressBarModule],
    templateUrl: './image.component.html',
    styleUrl: './image.component.css',
  })
  export class ImageComponent {
  
    imageUrl: string | null = null;
    selectedFile: File | null = null;
    loading = false;
  
    constructor(private imageService: ImageService) { }
  
    onFileChange(event: any): void {
      const file = event.target.files[0];
  
      if (file) {
        this.selectedFile = file;
        this.imageUrl = null;
        this.uploadImage();
      }
    }
  
    uploadImage(): void {
      if (!this.selectedFile) {
        this.imageService.showError('אנא בחר תמונה תחילה');
        return;
      }
  
      this.loading = true;
  
      this.imageService.uploadImage(this.selectedFile, (loading: boolean) => {
        this.loading = loading;
      }).subscribe({
        next: (imageUrl) => this.handleImageUploadSuccess(imageUrl),
        error: () => this.handleImageUploadError(),
      });
    }
  
    handleImageUploadSuccess(imageUrl: string | null): void {
      if (imageUrl) {
        this.imageUrl = imageUrl;
        this.imageService.checkImage(imageUrl, (validImageUrl) => {
          this.imageUrl = validImageUrl;
        });
      } else {
        this.imageUrl = this.imageService.defaultImage;
      }
    }
  
    handleImageUploadError(): void {
      this.imageService.showError('ישנה בעיה בשרת');
      this.imageUrl = this.imageService.defaultImage;
    }
  }
  

