export type EnvelopeObject<T> = {
  queue: string;
  message: T;
};
