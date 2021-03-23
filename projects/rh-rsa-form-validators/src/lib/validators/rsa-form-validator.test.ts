import { RsaFormValidator } from './rsa-form-validator'
import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms'
import { test, expect, describe } from '@jest/globals'

describe('Test RsaFormValidator', () => {
  describe('Test phoneNumber validator', () => {
    test('should not return any errors if no phone number was supplied', () => {
      const errors = testValidator('', RsaFormValidator.phoneNumber(false, false))
      expect(errors).toBeNull()
    })

    test('should not return any errors for a valid rsa phone number', () => {
      const errors = testValidator('02165441256', RsaFormValidator.phoneNumber(false, false))
      expect(errors).toBeNull()
    })

    test('should cater for a country code in an rsa phone number', () => {
      const errors = testValidator('+272165441256', RsaFormValidator.phoneNumber(true, false))
      expect(errors).toBeNull()
    })

    test('should return an error for a country code in an rsa phone number when a country code is not allowed', () => {
      const errors = testValidator('+272165441256', RsaFormValidator.phoneNumber(false, true))
      expect(errors.rsaPhoneNumber).toBeTruthy()
    })

    test('should cater for spaces in an rsa phone number', () => {
      const errors = testValidator('021 654 41256', RsaFormValidator.phoneNumber(true, true))
      expect(errors).toBeNull()
    })

    test('should return an error for spaces in an rsa phone number when spaces are not allowed', () => {
      const errors = testValidator('021 654 41256', RsaFormValidator.phoneNumber(true, false))
      expect(errors.rsaPhoneNumber).toBeTruthy()
    })

    test('should return an error for an invalid rsa phone number', () => {
      const errors = testValidator('0216544', RsaFormValidator.phoneNumber(false, false))
      expect(errors.rsaPhoneNumber).toBeTruthy()
    })
  })
})

const testValidator = (controlValue: string | number | Date, validator: ValidatorFn): ValidationErrors | null => {
  const control = new FormControl()
  control.setValidators(validator)
  control.setValue(controlValue)
  control.updateValueAndValidity()

  return control.errors
}
