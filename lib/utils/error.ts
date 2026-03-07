export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}