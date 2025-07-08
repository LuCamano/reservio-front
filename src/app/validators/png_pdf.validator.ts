import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fileTypeValidator(allowedTypes: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File;
    if (!file) {
      return null; // no hay archivo, dejar que otro Validator required lo maneje
    }

    // Obtener extensión o MIME
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const mime = file.type; // e.g. 'application/pdf' o 'image/png'

    // Comprobar si coincide con alguno
    const isValid = allowedTypes.some(type =>
      // si el array incluye 'pdf' o 'png', etc.
      ext === type.toLowerCase() ||
      mime === `application/${type}` ||
      mime.startsWith(`image/`) && type === 'image'
    );

    return isValid ? null : { fileType: { required: allowedTypes, actual: ext } };
  };
}