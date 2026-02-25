// import { NextFunction, Request, Response } from "express";
// import httpStatus from "http-status";
// import { ZodError } from "zod";
// import AppError from "../error/appError";

// const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
//   let statusCode = 500;
//   let message = "Something went wrong";
//   let errorMessage = "";
//   let errorDetails = {};
//   if (err instanceof ZodError) {
//     const concatedMessage = err.issues.map((issue, index) => {
//       if (index === err.issues.length - 1) {
//         return issue.message;
//       } else {
//         return issue.message + ".";
//       }
//     });
//     message = concatedMessage.join(" ") + ".";
//     errorDetails = {
//       issues: err.issues.map((issue) => ({
//         field: issue.path[1],
//         message: issue.message,
//       })),
//     };
//   } else if (err instanceof AppError) {
//     statusCode = err.statusCode;
//     message = err.message;
//     errorDetails = err;
//   }

//   res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//     success: false,
//     message,
//     errorDetails,
//   });
// };

// export default globalErrorHandler;

import { Prisma } from "@prisma/client";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import config from "../config";
import AppError from "../error/appError";
import handleClientError from "../error/handleClientError";
import handleValidationError from "../error/handleValidationError";
import handleZodError from "../error/handleZodError";
import { IGenericErrorMessage } from "../interface/error";
import { errorlogger } from "../utils/logger";

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  config.env === "development"
    ? console.log(`🐱‍🏍 globalErrorHandler ~~`, { error })
    : errorlogger.error(`🐱‍🏍 globalErrorHandler ~~`, error);

  let statusCode = 500;
  let message = "Something went wrong !";
  let errorMessages: IGenericErrorMessage[] = [];

  if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handleClientError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== "production" ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
