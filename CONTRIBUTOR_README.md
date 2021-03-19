# Angular South African Form Validators

A set of South African specific validators for Angular forms.

# Getting Started

1. Clone the repo.

3. Navigate to `projects/rh-rsa-form-validators`

2. Run `npm install`.

4. Create a feature or bugfix branch.

3. Make your changes.

4. Ensure that your changes are of good quality and comply with our [Coding Standards](#coding-standards).

5. Commit your changes and submit a PR to merge your changes into `main`.

# NPM Scripts

To check eslint, run command `npm run lint`.

To check unit tests, run command `npm run test`.

# Contribute

Ensure you work out of the project itself (`projects/rh-rsa-form-validators`) and not the Angular workspace

Always make the code better, if you see errors, please fix them. 

Add tests and try to move the code coverage up to 90%. 

Update the [usage documentation](/projects/rh-rsa-form-validators/README.md).

Bump the version number according to [semantic versioning](https://semver.org/#semantic-versioning-200).

Adhere to the [Coding Standards](#coding-standards).

Only the classes and models exported in `public-api.ts` will be exposed through the package.

# Coding Standards

TODO: Define coding standards

- Form validators should not make the form control required.
