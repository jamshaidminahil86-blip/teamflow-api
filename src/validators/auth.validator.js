export function validateRegister(data) {
  const errors = {};

  if (!data.name || data.name.trim() === "") {
    errors.name = "Name is required";
  }

  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
  }

  if (!data.password || data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return null;
}

export function validateLogin(data) {
  const errors = {};

  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
  }

  if (!data.password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return null;
}