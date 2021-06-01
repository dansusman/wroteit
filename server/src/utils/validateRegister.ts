import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email address",
      },
    ];
  }
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "username must not contain an @",
      },
    ];
  }
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2 characters",
      },
    ];
  }
  if (options.password.length < 8) {
    return [
      {
        field: "password",
        message: "password must be at least 8 characters",
      },
    ];
  }

  return null;
};
