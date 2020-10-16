export type Validity<Error = string> = { isValid: boolean; error?: Error };
export type Validations<T extends string, E = string> = Record<T, Validity<E>>;

type StringRecord<T> = Record<string, T>;
type ValidityIn = StringRecord<string>;
type ValidityOut<Error = string> = StringRecord<Validity<Error>>;

export function validate<Form extends ValidityIn, Error = string>(
  validator: (form: Form) => ValidityOut<Error>,
  form: Form
): ValidityOut<Error> {
  return validator(form);
}

export function isValid(validations: ValidityOut): boolean {
  return Object.entries(validations)
    .map(element => element[1])
    .map(validity => validity.isValid)
    .reduce((acc, curr) => acc && curr, true);
}

export default { isValid, validate };
