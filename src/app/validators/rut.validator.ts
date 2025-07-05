import { AbstractControl, ValidationErrors } from "@angular/forms";
import { validateRut } from "@fdograph/rut-utilities";

export function rutValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
        return null; // No validation error if the field is empty
    }
    let isValid = validateRut(value);
    return isValid ? null : { invalidRut: true };
}

