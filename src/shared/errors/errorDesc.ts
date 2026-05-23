const ErrorDesc = Object.freeze({
  REQUEST_SUCCESSFUL: {
    error: 0,
    errorDesc: "successful",
  },
  REG_MESSAGE_INCOMPLETE: {
    error: 1,
    errorDesc: "registration message does not have reuired attributes",
  },
  REG_MESSAGE_EMPTY: {
    error: 2,
    errorDesc: "registration message empty",
  },
  INVALID_FORMAT: {
    error: 3,
    errorDesc: "unable to parse data",
  },
  REGISTRATION_FAILED: {
    error: 4,
    errorDesc: "registration failed",
  },
  INVALID_DATA_TYPE: {
    error: 101,
    errorDesc: "invalid data type",
  },
  OPERATION_TIMEOUT: {
    error: 102,
    errorDesc: "operation timeout",
  },
  NO_VALID_FIELDS: {
    error: 105,
    errorDesc: "no data or dataType field found, both are required",
  },
  INTERNAL_ERROR: {
    error: 400,
    errorDesc: "Internal Error"
  },
  DATABASE_ERROR: 
  { error: 400,
    errorDesc: "Database Error"
  }
});

export default ErrorDesc;
