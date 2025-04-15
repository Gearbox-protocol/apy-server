export type Validated<T, B> = Pick<B, Extract<keyof B, keyof T>>;
export type NotValidated<T> = {
  [K in keyof T]?: Array<any> extends T[K] ? Array<unknown> : unknown;
};
