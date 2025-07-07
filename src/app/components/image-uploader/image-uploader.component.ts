import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

interface UploadedImage {
  file: File;
  name: string;
  size: string;
  dataUrl: string;
  category: string;
  customName: string;
}

@Component({
  selector: 'app-image-uploader',
  standalone: false,
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.scss'
})
export class ImageUploaderComponent {

  // Manejo de imágenes
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() imagesChange = new EventEmitter<string[]>(); // Puedes emitir dataUrl o archivos según tu necesidad
  
  images: UploadedImage[] = [];
  category: string = 'general';
  imageName: string = '';
  isDragging: boolean = false;
  uploading: boolean = false;
  uploadProgress: number = 0;

  // Maneja el arrastre sobre el área
  handleDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  // Maneja cuando el arrastre sale del área
  handleDragLeave() {
    this.isDragging = false;
  }

  // Maneja cuando se sueltan archivos
  handleDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    
    if (event.dataTransfer?.files) {
      this.processFiles(event.dataTransfer.files);
    }
  }

  // Abre el selector de archivos
  openFilePicker() {
    this.fileInput.nativeElement.click();
  }

  // Maneja la selección de archivos
  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(input.files);
      // Resetear el input para permitir seleccionar los mismos archivos otra vez
      input.value = '';
    }
  }

  // Procesa los archivos seleccionados
  processFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) continue;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.images.push({
            file: file,
            name: file.name,
            size: this.formatFileSize(file.size),
            dataUrl: e.target.result as string,
            category: this.category,
            customName: this.imageName || file.name
          });
          // Emitir las imágenes actualizadas
          this.imagesChange.emit(this.images.map(img => img.dataUrl));
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Formatea el tamaño del archivo
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Elimina una imagen específica
  removeImage(index: number) {
    this.images.splice(index, 1);
    this.imagesChange.emit(this.images.map(img => img.dataUrl));
  }

  removeAllImages() {
    if (this.images.length === 0) return;
    if (confirm('¿Estás seguro de que quieres eliminar todas las imágenes?')) {
      this.images = [];
      this.imagesChange.emit([]);
    }
  }

  // Resetea el formulario
  resetForm() {
    this.images = [];
    this.category = 'general';
    this.imageName = '';
  }

  // Simula la subida de imágenes
  uploadImages() {
    if (this.images.length === 0) {
      alert('Por favor, selecciona al menos una imagen');
      return;
    }
    
    this.uploading = true;
    this.uploadProgress = 0;
    
    // Simulación de subida
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.uploading = false;
          alert(`¡Éxito! ${this.images.length} imágenes subidas correctamente.`);
        }, 500);
      }
    }, 300);
  }

  // Guarda los cambios
  saveChanges() {
    if (this.images.length === 0) {
      alert('No hay imágenes para guardar');
      return;
    }
    
    // Aquí iría la lógica para guardar los cambios en el backend
    console.log('Imágenes a guardar:', this.images);
    alert('Cambios guardados correctamente');
  }
}
