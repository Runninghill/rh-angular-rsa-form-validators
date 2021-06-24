![Runninghill Logo](https://github.com/Runninghill/rh-angular-rsa-form-validators/blob/67badb0d7a78dca5c7ccacb729bbb3e5b0c5f8db/docs/runninghill.png?raw=true "Runninghill")

# Angular South African Form Validators

> Please note that this is the README for consumers, if you
> plan on contributing to this package, please take a
> look [here](https://github.com/Runninghill/rh-angular-rsa-form-validators/blob/main/projects/rh-rsa-form-validators/README.md).

A set of South African specific validators for Angular forms.

# Getting Started🏁

If you plan on contributing to the package please read the contributor readme.

1. Run `npm install rh-angular-rsa-form-validators` in your Angular project.

2. Import and use the exposed classes to validate your Angular form controls.

# Usage💡

To begin validating your South African specific forms and form controls, start by **importing**
the _RsaFormValidators_ class.

```Javascript
import { RsaFormValidator } from 'rh-angular-rsa-form-validators'
```

For form control validators:

Add the appropriate validator to your form control(s).

```Javascript
// When creating your form
this.form = this.formBuilder.group({
    name: ['', Validators.required],
    mobileNumber: ['', [Validators.required, RsaFormValidator.phoneNumber(false, true)]],
    workNumber: ['']
})

// After the form is already created
this.form.controls['workNumber'].setValidators([RsaFormValidators.phoneNumber(false, true)])
```

For form validators:

Add the appropriate validator to your form.

```Javascript
// When creating your form
this.form = this.formBuilder.group({
    idNumber: [''],
    gender: [''],
    address: ['']
}, RsaFormValidator.idNumberForm('idNumber', null, 'gender'))

// After the form is already created
this.form.controls['workNumber'].setValidators([RsaFormValidators.phoneNumber(false, true)])
```

To determine if the form control passed the validation, check the errors object on the form control.

RsaFormValidator error objects on form controls will always be the name of the validator, 
prefixed with 'rsa' eg; for the rsa phone number validator, the error object is `rsaPhoneNumber`
(rsa + phoneNumber = rsaPhoneNumber) 

```Javascript
if (this.form.controls['mobileNumber'].errors.rsaPhoneNumber)
    errorMessage = 'Mobile number must be a valid South African phone number.'
```

# API Reference📖

### RsaFormValidator

Contains form control validators used to validate South African specific form fields.

[_source code_](https://github.com/Runninghill/rh-angular-rsa-form-validators/blob/main/projects/rh-rsa-form-validators/src/lib/validators/rsa-form-validator.ts)

#### Methods

##### phoneNumber

Returns a validator which determines if a form control is a valid South African phone number.

Error on form errors object: `rsaPhoneNumber: true`

Parameters

|Name|Type|Description|Default|
|----|----|-----------|-------|
|allowCountryCode|boolean|determines if the phone number is allowed to contain the South African country code (+27)|true|
|allowSpaces|boolean|determines if a phone number is allowed to contain spaces|true|


##### idNumber

Returns a validator which determines if a form control is a valid South African ID number.

Error on form errors object: `rsaIdNumber: true`

##### idNumberForm

Returns a validator which determines if a form contains a valid South African ID number.

You can optionally provide the name of certain inputs to compare the information on the
ID number (such as gender, date of birth etc.) to the values of the inputs on the form.

Error on form errors object: `rsaIdNumber: true`

Parameters

|Name|Type|Description|Control Value Type|Required|
|----|----|-----------|------------------|--------|
|idNumberControlName|string|name of the ID number control on the form|string|true
|dateOfBirthControlName|string|name of the date of birth control on the form|date|false
|genderControlName|string|name of the gender control on the form|string|false
|isCitizenControlName|string|name of the is South African citizen control on the form|boolean|false
|ageControlName|string|name of the age control on the form|number|false
