// TODO: Move all validation logic to a separate package so that this package only wraps that logic
export class RsaIdValidationLogic {
  static validateIdNumber(
    idNumber: string,
    idNumberHolderKnownInfo: any = null
  ): boolean {
    if (idNumber.length !== 13 || isNaN(Number(idNumber))) return false

    const dateOfBirth = RsaIdValidationLogic.determineDateOfBirth(idNumber)
    if (isNaN(dateOfBirth.getTime())) return false

    if (idNumberHolderKnownInfo) {
      if (
        idNumberHolderKnownInfo.dateOfBirth &&
        idNumberHolderKnownInfo.dateOfBirth.getTime() !== dateOfBirth.getTime()
      ) return false

      if (idNumberHolderKnownInfo.age) {
        const age = RsaIdValidationLogic.determineAge(idNumber)
        if (idNumberHolderKnownInfo.age !== age) return false
      }

      if (idNumberHolderKnownInfo.gender) {
        const gender = RsaIdValidationLogic.determineGender(idNumber)
        if (idNumberHolderKnownInfo.gender[0].toLowerCase() !== gender[0].toLowerCase()) return false
      }

      if (idNumberHolderKnownInfo.isCitizen !== undefined && idNumberHolderKnownInfo.isCitizen !== null) {
        const isCitizen = RsaIdValidationLogic.determineIsCitizen(idNumber)
        if (idNumberHolderKnownInfo.isCitizen !== isCitizen) return false
      }
    }

    let tempTotal = 0
    let checkSum = 0
    let multiplier = 1
    for (let i = 0; i < 13; ++i) {
      tempTotal = Number(idNumber.charAt(i)) * multiplier
      if (tempTotal > 9) tempTotal = Number(tempTotal.toString().charAt(0)) + Number(tempTotal.toString().charAt(1))
      checkSum = checkSum + tempTotal
      multiplier = multiplier % 2 === 0 ? 1 : 2
    }

    return checkSum % 10 === 0
  }

  static determineDateOfBirth(idNumber: string): Date {
    let dateOfBirthYear = idNumber.substring(0, 2)
    const currentYear = new Date().getFullYear().toString().substring(2, 4)
    dateOfBirthYear = Number(dateOfBirthYear) <= Number(currentYear) ? '20' : '19' + dateOfBirthYear

    return new Date(`${dateOfBirthYear}-${idNumber.substring(2, 4)}-${idNumber.substring(4, 6)}T00:00:00`)
  }

  static determineAge(idNumber: string): number {
    const dateOfBirthEpoch = RsaIdValidationLogic.determineDateOfBirth(idNumber).getTime()
    const todayEpoch = new Date().getTime()

    const MILLISECONDS_IN_A_YEAR = 31556952000
    const ageInMilliseconds = todayEpoch - dateOfBirthEpoch
    return Math.floor(ageInMilliseconds / MILLISECONDS_IN_A_YEAR)
  }

  static determineGender(idNumber: string): 'female' | 'male' {
    const genderCode = idNumber.substring(6, 10)
    return Number(genderCode) < 5000 ? 'female' : 'male'
  }

  static determineIsCitizen(idNumber: string): boolean {
    return Number(idNumber.substring(10, 11)) === 0
  }
}
