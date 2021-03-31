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

To begin validating your South African specific form fields, start by importing
the _RsaFormValidators_ class.

```Javascript
import { RsaFormValidator } from 'rh-angular-rsa-form-validators'
```

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

##### phoneNumber(allowCountryCode, allowSpaces)

Returns a validator which determines if a form control is a valid South African phone number.

Parameters

|Name|Type|Description|Default|
|----|----|-----------|-------|
|allowCountryCode|boolean|determines if the phone number is allowed to contain the South African country code (+27)|true|
|allowSpaces|boolean|determines if a phone number is allowed to contain spaces|true|
