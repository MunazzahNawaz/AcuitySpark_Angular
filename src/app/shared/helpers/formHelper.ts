import { FormArray, FormGroup, FormControl } from '@angular/forms';

export abstract class FormHelper {

  public static validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        this.markDirty(control);
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => this.validateAllFormFields(<FormGroup> c));
      }
    });
  }
  private static markDirty(control: FormControl) {
    control.markAsTouched({ onlySelf: true });
  }


}
