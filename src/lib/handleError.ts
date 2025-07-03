import { AxiosError } from "axios";

function handleError(error: unknown, errorType: string) {
  if(error instanceof AxiosError){
    console.log('axios error', error)
    return {
    type: errorType,
    message: error.response?.data.message
  };
  }
  return {
    type: errorType,
    message: error instanceof Error ? error.message : "An error occurred while "+ errorType,
  };
}

export {handleError}