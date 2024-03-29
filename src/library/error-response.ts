import { HttpStatus, HttpException } from '@nestjs/common';

const ErrorResponse = (
  message: any,
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  data: any
) => {
  if (message.message) {
    message = message.message;
  }

  return { message, status, data }

};
export default ErrorResponse;
