import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  defaultImage: string = 'assets/no-image.png';

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) { }

  uploadImage(file: File, setLoading: (loading: boolean) => void): Observable<string | null> {
    if (!file) {
      this.showError('אנא בחר תמונה תחילה');
      return of(null);
    }

    const formData = new FormData();
    formData.append('image', file, file.name);
    setLoading(true);

    return this.apiService.uploadImage(formData).pipe(
      map(response => response.url || null),
      catchError(error => this.handleUploadError(error)),
      finalize(() => setLoading(false))
    );
  }

  checkImage(url: string | null, setImage: (url: string) => void): void {
    if (!url) {
      this.showError('אין תמונה להצגה');
      setImage(this.defaultImage);
      return;
    }

    const img = new Image();
    img.onload = () => setImage(url);
    img.onerror = () => {
      setImage(this.defaultImage);
      this.showError('בעיה בהצגת התמונה');
    };
    img.src = url;
  }

  private handleUploadError(error: any): Observable<string | null> {
    if (error.status === 0) {
      this.showError('השרת לא פעיל');
      return of();
    } 
    else if (error.status >= 500) {
      this.showError('ישנה בעיה בשרת');
      return of();
    } 
    else {
      this.showError(`שגיאה בהעלאת התמונה: ${error.status}`);
      return of(this.defaultImage);
    }
  }

  showError(message: string): void {
    this.snackBar.dismiss();
    this.snackBar.open(message, 'סגור', { duration: 3000 });
  }


}
