function handleError(error: unknown, errorType: string) {
  return {
    type: errorType,
    message: error instanceof Error ? error.message : "An error occurred while "+ errorType,
  };
}

export {handleError}