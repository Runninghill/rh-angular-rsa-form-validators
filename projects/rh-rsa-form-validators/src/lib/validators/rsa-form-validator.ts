import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'
import { RsaIdValidationLogic } from '../logic/rsa-id-validation-logic'

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

  static idNumber(control: AbstractControl): ValidationErrors | null {
    if (control.value.trim() && !RsaIdValidationLogic.validateIdNumber(control.value))
      return { rsaIdNumber: true }

    return null
  }

  static idNumberForm(
    idNumberControlName: string,
    dateOfBirthControlName?: string,
    genderControlName?: string,
    isCitizenControlName?: string,
    ageControlName?: string
  ): ValidatorFn {
    const validatorFn = (control: AbstractControl): ValidationErrors | null => {
      const idNumber = control.get(idNumberControlName) && control.get(idNumberControlName).value
      const dateOfBirth = control.get(dateOfBirthControlName) && control.get(dateOfBirthControlName).value
      const gender = control.get(genderControlName) && control.get(genderControlName).value
      const isCitizen = control.get(isCitizenControlName) && control.get(isCitizenControlName).value
      const age = control.get(ageControlName) && control.get(ageControlName).value

      if (idNumber.trim() && !RsaIdValidationLogic.validateIdNumber(idNumber, { dateOfBirth, gender, isCitizen, age }))
        return { rsaIdNumber: true }

      return null
    }
    return validatorFn
  }
}
