//GlobalErrorHandling.js

export const globalErrorHandling = (err, req, res, next) => {
    //Must be last middleware
    let error = err.message;
    let code = err.statuscode || 500;
    res.status(code).json({ error });
  };