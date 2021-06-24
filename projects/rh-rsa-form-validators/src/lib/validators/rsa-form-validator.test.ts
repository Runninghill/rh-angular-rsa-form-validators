import { RsaFormValidator } from './rsa-form-validator'
import { FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms'
import { test, expect, describe } from '@jest/globals'
import * as sinon from 'sinon'

describe('Test RsaFormValidator', () => {
  describe('Test phoneNumber validator', () => {
    test('should not return any errors if no phone number was supplied', () => {
      const errors = testValidatorOnControl('', RsaFormValidator.phoneNumber(false, false))
      expect(errors).toBeNull()
    })

    test('should not return any errors for a valid rsa phone number', () => {
      const errors = testValidatorOnControl('02165441256', RsaFormValidator.phoneNumber(false, false))
      expect(errors).toBeNull()
    })

    test('should cater for a country code in an rsa phone number', () => {
      const errors = testValidatorOnControl('+272165441256', RsaFormValidator.phoneNumber(true, false))
      expect(errors).toBeNull()
    })

    test('should return an error for a country code in an rsa phone number when a country code is not allowed', () => {
      const errors = testValidatorOnControl('+272165441256', RsaFormValidator.phoneNumber(false, true))
      expect(errors.rsaPhoneNumber).toBeTruthy()
    })

    test('should cater for spaces in an rsa phone number', () => {
      const errors = testValidatorOnControl('021 654 41256', RsaFormValidator.phoneNumber(true, true))
      expect(errors).toBeNull()
    })

    test('should return an error for spaces in an rsa phone number when spaces are not allowed', () => {
      const errors = testValidatorOnControl('021 654 41256', RsaFormValidator.phoneNumber(true, false))
      expect(errors.rsaPhoneNumber).toBeTruthy()
    })

    test('should return an error for an invalid rsa phone number', () => {
      const errors = testValidatorOnControl('0216544', RsaFormValidator.phoneNumber(false, false))
      expect(errors.rsaPhoneNumber).toBeTruthy()
    })
  })

  describe('Test idNumber validator', () => {
    test('should not return any errors if an id number is not supplied', () => {
      const errors = testValidatorOnControl('', RsaFormValidator.idNumber)
      expect(errors).toBeNull()
    })

    test('should not return any errors if a valid id number is supplied', () => {
      const errors = testValidatorOnControl('0102043233083', RsaFormValidator.idNumber)
      expect(errors).toBeNull()
    })

    test('should not return error if an invalid id number is supplied', () => {
      const errors = testValidatorOnControl('0103153233083', RsaFormValidator.idNumber)
      expect(errors.rsaIdNumber).toBeTruthy()
    })
  })

  describe('Test idNumberForm validator', () => {
    test('should not return any errors if an id number is not supplied', () => {
      const errors = testValidatorOnForm(
        [
          { name: 'idNumber', value: '' },
          { name: 'dateOfBirth', value: new Date('2001/02/04') },
        ],
        RsaFormValidator.idNumberForm('idNumber', 'dateOfBirth')
      )

      expect(errors).toBeNull()
    })

    test('should not return any errors if no id number holder info control names are supplied', () => {
      const errors = testValidatorOnForm(
        [
          { name: 'idNumber', value: '' },
          { name: 'dateOfBirth', value: new Date('2001/02/04') },
        ],
        RsaFormValidator.idNumberForm('idNumber')
      )

      expect(errors).toBeNull()
    })

    test('should not require the given id number holder info controls to have values', () => {
      const errors = testValidatorOnForm(
        [
          { name: 'idNumber', value: '0102044818080' },
          { name: 'gender', value: '' },
          { name: 'age', value: '' },
          { name: 'dateOfBirth', value: new Date('2001/02/04') },
        ],
        RsaFormValidator.idNumberForm(
          'idNumber',
          'dateOfBirth',
          'gender',
          null,
          'age'
        )
      )

      expect(errors).toBeNull()
    })

    describe('should be able to validate an id number against the id number holder\'s date of birth', () => {
      test('should not return any errors if the date of birth in the form matches the id number', () => {
        const errors = testValidatorOnForm(
          [
            { name: 'idNumber', value: '0102044818080' },
            { name: 'dateOfBirth', value: '2001/02/04' },
          ],
          RsaFormValidator.idNumberForm('idNumber', 'dateOfBirth')
        )

        expect(errors).toBeNull()
      })

      test('should return an error if the date of birth in the form does not match the id number', () => {
        const errors = testValidatorOnForm(
          [
            { name: 'idNumber', value: '0102044818080' },
            { name: 'dateOfBirth', value: '1990/05/14' },
          ],
          RsaFormValidator.idNumberForm('idNumber', 'dateOfBirth')
        )

        expect(errors.rsaIdNumber).toBeTruthy()
      })

      test('should work with a date of birth in the form from various timezones', () => {
        sinon.stub()

        const validator = RsaFormValidator.idNumberForm('idNumber', 'dateOfBirth')
        const formControls = [
            { name: 'idNumber', value: '0102044818080' },
            { name: 'dateOfBirth', value: '1990/05/14' },
        ]

        expect(errors.rsaIdNumber).toBeTruthy()
      })
    })

    describe('should be able to validate an id number against the id number holder\'s age', () => {
      const stubbedCurrentDate = new Date('2018/03/30')
      let clock

      beforeEach(() => clock = sinon.useFakeTimers(stubbedCurrentDate.getTime()))

      afterEach(() => clock.restore())

      test('should not return any errors if the age in the form matches the id number', () => {
        const errors = testValidatorOnForm(
          [
            { name: 'idNumber', value: '0102044818080' },
            { name: 'age', value: 17 },
          ],
          RsaFormValidator.idNumberForm(
            'idNumber',
            null,
            null,
            null,
            'age'
          )
        )

        expect(errors).toBeNull()
      })

      test('should return an error if the age in the form does not match the id number', () => {
        const errors = testValidatorOnForm(
          [
            { name: 'idNumber', value: '0102044818080' },
            { name: 'age', value: 16 },
          ],
          RsaFormValidator.idNumberForm(
            'idNumber',
            null,
            null,
            null,
            'age'
          )
        )

        expect(errors.rsaIdNumber).toBeTruthy()
      })
    })

    describe('should be able to validate an id number against the id number holder\'s gender', () => {
      test('should not return any errors if the gender in the form matches the id number', () => {
        const errors = testValidatorOnForm(
          [
            { name: 'idNumber', value: '0102044818080' },
            { name: 'gender', value: 'Female' },
          ],
          RsaFormValidator.idNumberForm(
            'idNumber',
            null,
            'gender'
          )
        )

        expect(errors).toBeNull()
      })

      test('should return an error if the gender in the form does not match the id number', () => {
        const errors = testValidatorOnForm(
          [
            { name: 'idNumber', value: '0102044818080' },
            { name: 'gender', value: 'Male' },
          ],
          RsaFormValidator.idNumberForm(
            'idNumber',
            null,
            'gender'
          )
        )

        expect(errors.rsaIdNumber).toBeTruthy()
      })
    })

    describe('should be able to validate an id number against the id number holder\'s citizenship', () => {
      test('should not return any errors if the citizenship in the form matches the id number', () => {
        const errors = testValidatorOnForm(
          [
            { name: 'idNumber', value: '0102044818080' },
            { name: 'isCitizen', value: true },
          ],
          RsaFormValidator.idNumberForm(
            'idNumber',
            null,
            null,
            'isCitizen'
          )
        )

        expect(errors).toBeNull()
      })

      test('should return an error if the citizenship in the form does not match the id number', () => {
        const errors = testValidatorOnForm(
          [
            { name: 'idNumber', value: '0102044818080' },
            { name: 'isCitizen', value: false },
          ],
          RsaFormValidator.idNumberForm(
            'idNumber',
            null,
            null,
            'isCitizen'
          )
        )

        expect(errors.rsaIdNumber).toBeTruthy()
      })
    })

    describe('should be able to validate an id number against multiple id number holder info', () => {
      test('should not return any errors if the id number holder info in the form matches the id number', () => {
        const errors = testValidatorOnForm(
          [
            { name: 'idNumber', value: '0102044818080' },
            { name: 'isCitizen', value: true },
            { name: 'gender', value: 'female' }
          ],
          RsaFormValidator.idNumberForm(
            'idNumber',
            null,
            'gender',
            'isCitizen'
          )
        )

        expect(errors).toBeNull()
      })

      test('should return an error if some of the id number holder info in the form does not match the id number', () => {
        const errors = testValidatorOnForm(
          [
            { name: 'idNumber', value: '0102044818080' },
            { name: 'isCitizen', value: false },
            { name: 'gender', value: 'female' }
          ],
          RsaFormValidator.idNumberForm(
            'idNumber',
            null,
            'gender',
            'isCitizen'
          )
        )

        expect(errors.rsaIdNumber).toBeTruthy()
      })

      test('should return an error if all the id number holder info in the form does not match the id number', () => {
        const errors = testValidatorOnForm(
          [
            { name: 'idNumber', value: '0102044818080' },
            { name: 'isCitizen', value: false },
            { name: 'gender', value: 'male' }
          ],
          RsaFormValidator.idNumberForm(
            'idNumber',
            null,
            'gender',
            'isCitizen'
          )
        )

        expect(errors.rsaIdNumber).toBeTruthy()
      })
    })
  })
})

const testValidatorOnControl = (controlValue: string | number | Date, validator: ValidatorFn): ValidationErrors | null => {
  const control = new FormControl()
  control.setValidators(validator)
  control.setValue(controlValue)
  control.updateValueAndValidity()

  return control.errors
}

const testValidatorOnForm = (controls: { name: string, value: any }[], validator: ValidatorFn): ValidationErrors | null => {
  const formControls = {}
  controls.forEach((control) => formControls[control.name] = new FormControl(control.value))
  const form = new FormGroup(formControls, { validators: validator })
  form.updateValueAndValidity()

  return form.errors
}
