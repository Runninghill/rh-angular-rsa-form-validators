import { RsaIdValidationLogic } from './rsa-id-validation-logic'
import { test, expect, describe, beforeEach, afterEach } from '@jest/globals'
import * as sinon from 'sinon'

describe('Test RsaIdValidationLogic', () => {
  describe('Test determineDateOfBirth', () => {
    test('should be able to determine the date of birth on a valid id number', () => {
      const actualDateOfBirth = new Date('2000/09/13')
      const determinedDateOfBirth = RsaIdValidationLogic.determineDateOfBirth('0009139967088')

      expect(determinedDateOfBirth.getTime()).toEqual(actualDateOfBirth.getTime())
    })

    test('should be able to determine the date of birth on a valid id number from before the year 2000', () => {
      const actualDateOfBirth = new Date('1990/05/02')
      const determinedDateOfBirth = RsaIdValidationLogic.determineDateOfBirth('9005025586082')

      expect(determinedDateOfBirth.getTime()).toEqual(actualDateOfBirth.getTime())
    })

    test('should be able to determine the date of birth on a valid id number from the year 2000', () => {
      const actualDateOfBirth = new Date('2000/02/20')
      const determinedDateOfBirth = RsaIdValidationLogic.determineDateOfBirth('0002205144088')

      expect(determinedDateOfBirth.getTime()).toEqual(actualDateOfBirth.getTime())
    })

    test('should be able to determine the date of birth on a valid id number from after the year 2000', () => {
      const actualDateOfBirth = new Date('2009/04/02')
      const determinedDateOfBirth = RsaIdValidationLogic.determineDateOfBirth('0904026279086')

      expect(determinedDateOfBirth.getTime()).toEqual(actualDateOfBirth.getTime())
    })
  })

  describe('Test determineAge', () => {
    let clock
    const stubbedCurrentDate = new Date('2018/03/30')

    beforeEach(() => {
      clock = sinon.useFakeTimers(stubbedCurrentDate.getTime())
    })

    afterEach(() => {
      clock.restore()
    })

    test('should be able to determine the age on a valid id number', () => {
      const actualAge = 16
      const determinedAge = RsaIdValidationLogic.determineAge('0109137813084')

      expect(determinedAge).toEqual(actualAge)
    })

    test('should be able to determine the age on a valid id number from before the year 2000', () => {
      const actualAge = 27
      const determinedAge = RsaIdValidationLogic.determineAge('9005025586082')

      expect(determinedAge).toEqual(actualAge)
    })

    test('should be able to determine the age on a valid id number from the year 2000', () => {
      const actualAge = 18
      const determinedAge = RsaIdValidationLogic.determineAge('0002205144088')

      expect(determinedAge).toEqual(actualAge)
    })

    test('should be able to determine the age on a valid id number from after the year 2000', () => {
      const actualAge = 8
      const determinedAge = RsaIdValidationLogic.determineAge('0904026279086')

      expect(determinedAge).toEqual(actualAge)
    })
  })

  describe('Test determineIsCitizen', () => {
    test('should return true for valid citizen id numbers', () => {
      const citizenIdNumbers = ['9806025369084', '8805066948088', '6706193468085', '9509122416085', '8701144189086']

      citizenIdNumbers.forEach(citizenIdNumber => {
        expect(RsaIdValidationLogic.determineIsCitizen(citizenIdNumber)).toEqual(true)
      })
    })

    test('should return false for valid non-citizen id numbers', () => {
      const citizenIdNumbers = ['8701140138186', '9511254677187', '8306049271185', '9606136397184', '9902102616180']

      citizenIdNumbers.forEach(citizenIdNumber => {
        expect(RsaIdValidationLogic.determineIsCitizen(citizenIdNumber)).toEqual(false)
      })
    })
  })

  describe('Test determineGender', () => {
    test('should return \'male\' for valid male id numbers', () => {
      const maleIdNumbers = ['9902107174185', '5108145185084', '6706025999083', '8009099919089', '9908198271087']

      maleIdNumbers.forEach(citizenIdNumber => {
        expect(RsaIdValidationLogic.determineGender(citizenIdNumber)).toEqual('male')
      })
    })

    test('should return \'female\' for valid female id numbers', () => {
      const femaleIdNumbers = ['9905190928086', '0111193095085', '6508070078080', '8201224565081', '6712272244082']

      femaleIdNumbers.forEach(citizenIdNumber => {
        expect(RsaIdValidationLogic.determineGender(citizenIdNumber)).toEqual('female')
      })
    })
  })

  describe('Test validateIdNumber', () => {
    describe('with no known id number holder info', () => {
      test('should return true on a valid id number', () => {
        expect(RsaIdValidationLogic.validateIdNumber('6712272244082')).toEqual(true)
      })

      test('should return false on an id number which is less than 13 digits long', () => {
        expect(RsaIdValidationLogic.validateIdNumber('61422733')).toEqual(false)
      })

      test('should return false on an id number which contains characters other than digits', () => {
        expect(RsaIdValidationLogic.validateIdNumber('6L122L22AAOB2')).toEqual(false)
      })

      test('should return false on an id number with an invalid checksum', () => {
        expect(RsaIdValidationLogic.validateIdNumber('6142273344082')).toEqual(false)
      })
    })

    describe('with the id number holder\'s date of birth known', () => {
      const knownInfo = { dateOfBirth: new Date('2004/09/13') }

      test('should return true on an id number which matches the date of birth', () => {
        expect(RsaIdValidationLogic.validateIdNumber('0409130295085', knownInfo)).toEqual(true)
      })

      test('should return false on an id number which does not match the date of birth', () => {
        expect(RsaIdValidationLogic.validateIdNumber('9405134109083', knownInfo)).toEqual(false)
      })
    })

    describe('with the id number holder\'s age known', () => {
      let clock
      const stubbedCurrentDate = new Date('2018/03/30')
      const knownInfo = { age: 13 }

      beforeEach(() => {
        clock = sinon.useFakeTimers(stubbedCurrentDate.getTime())
      })

      afterEach(() => {
        clock.restore()
      })

      test('should return true on an id number which matches the age', () => {
        expect(RsaIdValidationLogic.validateIdNumber('0409130295085', knownInfo)).toEqual(true)
      })

      test('should return false on an id number which does not match the age', () => {
        expect(RsaIdValidationLogic.validateIdNumber('9405134109083', knownInfo)).toEqual(false)
      })
    })

    describe('with the id number holder\'s gender known', () => {
      const knownInfo = { gender: 'female' }

      test('should return true on an id number which matches the gender', () => {
        expect(RsaIdValidationLogic.validateIdNumber('9405134342080', knownInfo)).toEqual(true)
      })

      test('should return false on an id number which does not match the gender', () => {
        expect(RsaIdValidationLogic.validateIdNumber('9405137664084', knownInfo)).toEqual(false)
      })
    })

    describe('with the id number holder\'s citizenship known', () => {
      const knownInfo = { isCitizen: true }

      test('should return true on an id number which matches the citizenship', () => {
        expect(RsaIdValidationLogic.validateIdNumber('9405139618088', knownInfo)).toEqual(true)
      })

      test('should return false on an id number which does not match the citizenship', () => {
        expect(RsaIdValidationLogic.validateIdNumber('9405139019188', knownInfo)).toEqual(false)
      })
    })

    describe('with multiple id number holder info known', () => {
      const knownInfo = { dateOfBirth: new Date('2001/09/15'), gender: 'male' }

      test('should return true on an id number which matches the known info', () => {
        expect(RsaIdValidationLogic.validateIdNumber('0109156601188', knownInfo)).toEqual(true)
      })

      test('should return false on an id number which does not match some of the known info', () => {
        expect(RsaIdValidationLogic.validateIdNumber('0109133948181', knownInfo)).toEqual(false)
      })

      test('should return false on an id number which does not match any of the known info', () => {
        expect(RsaIdValidationLogic.validateIdNumber('2103313705089', knownInfo)).toEqual(false)
      })
    })

    describe('with all id number holder info known', () => {
      let clock
      const stubbedCurrentDate = new Date('2018/03/30')
      const knownInfo = {
        dateOfBirth: new Date('2001/09/15'),
        gender: 'male',
        isCitizen: false,
        age: 16,
      }

      beforeEach(() => {
        clock = sinon.useFakeTimers(stubbedCurrentDate.getTime())
      })

      afterEach(() => {
        clock.restore()
      })

      test('should return true on an id number which matches the known info', () => {
        expect(RsaIdValidationLogic.validateIdNumber('0109157840181', knownInfo)).toEqual(true)
      })

      test('should return false on an id number which does not match some of the known info', () => {
        expect(RsaIdValidationLogic.validateIdNumber('0109154774086', knownInfo)).toEqual(false)
      })

      test('should return false on an id number which does not match any of the known info', () => {
        expect(RsaIdValidationLogic.validateIdNumber('0102043308083', knownInfo)).toEqual(false)
      })
    })
  })
})
