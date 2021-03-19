import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export class RsaFormValidator {
  static phoneNumber(allowCountryCode = true, allowSpaces = true): ValidatorFn {
    const validatorFn = (control: AbstractControl): ValidationErrors | null => {
      const regex = allowCountryCode ? /(\+27|0)[0-9]{9}/ : /0[0-9]{9}/
      const phoneNumber = allowSpaces ? control.value.replace(/ /g, '') : control.value

      if (phoneNumber.trim() && !regex.test(phoneNumber)) return { rsaPhoneNumber: true }

      return null
    }
    return validatorFn
  }
}
