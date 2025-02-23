import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    error = '';
    defaultImage = 'assets/no-image.png';

    constructor(private imageService: ImageService, private snackBar: MatSnackBar) { }

    onFileChange(event: any): void {
        const file = event.target.files[0];

        if (file) {
            this.selectedFile = file;
            this.imageUrl = null;  
            this.error = '';        

            this.uploadImage();
        }
    }

    uploadImage(): void {
        if (!this.selectedFile) {
            this.showError('אנא בחר תמונה תחילה');
            return;
        }

        this.loading = true;
        this.error = '';

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
            this.imageUrl = this.defaultImage;
        }
    }

    handleImageUploadError(): void {
        this.showError('ישנה בעיה בשרת');
        this.imageUrl = null; 
    }

    showError(message: string): void {
        this.error = message;
        this.snackBar.open(message, 'סגור', { duration: 3000 });
    }
}
