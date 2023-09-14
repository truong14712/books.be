import asyncHandler from 'express-async-handler';

const asyncHandlerDecorator = (controller) => {
  for (const key in controller) {
    if (typeof controller[key] === 'function') {
      controller[key] = asyncHandler(controller[key]);
    }
  }
  return controller;
};

export default asyncHandlerDecorator;
