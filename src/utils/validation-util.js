const HttpError = require("./http-error");

exports.validateId = async (id) => {
  if (Number.isInteger(id) === true && parseInt(id) >= 0) {
    return true;
  } else {
    throw new HttpError(
      "The given ID is invalid because it is not a positive integer: " + id,
      400
    );
  }
};

exports.validatePositiveDecimal = async (number) => {
  if (isNaN(number) || parseFloat(number) <= 0) {
    throw new HttpError(
      "The given number is not a positive decimal: " + number,
      400
    );
  } else {
    return true;
  }
};
