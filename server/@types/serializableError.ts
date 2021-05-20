type TsError = Error;

interface ErrorBody {
  errors: {
    [type: string]: {
      message: string;
      name: string;
    };
  };
}

export interface SerializableError extends TsError {
  toJSON: () => ErrorBody;
}
