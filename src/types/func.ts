export type PartialByKey<T extends object, U extends keyof T> = ToObj<
  Omit<T, U> & {
    [P in U]?: T[P];
  }
>;
export type ToObj<T extends object> = {
  [P in keyof T]: T[P];
};
