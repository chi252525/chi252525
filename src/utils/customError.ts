class CustomError extends Error {
  public response: unknown;
  constructor(message: string, response: unknown) {
    super(message);
    this.name = 'CustomError';
    this.response = response;
  }
}

export { CustomError };
