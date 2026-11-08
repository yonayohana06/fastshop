import validator from "validator";
import DOMPurify from "dompurify";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitized: Record<string, string>;
}

export function validateAndSanitizeLogin(
  email: string,
  password: string
): ValidationResult {
  const errors: ValidationError[] = [];
  const sanitized: Record<string, string> = {};

  if (!email || !email.trim()) {
    errors.push({ field: "email", message: "Email wajib diisi" });
  } else if (!validator.isEmail(email.trim())) {
    errors.push({ field: "email", message: "Format email tidak valid" });
  } else {
    sanitized.email = validator.normalizeEmail(email.trim()) || email.trim();
  }

  if (!password) {
    errors.push({ field: "password", message: "Kata sandi wajib diisi" });
  } else if (password.length < 6) {
    errors.push({ field: "password", message: "Kata sandi minimal 6 karakter" });
  } else {
    sanitized.password = password;
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

export function validateAndSanitizeRegister(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: ValidationError[] = [];
  const sanitized: Record<string, string> = {};

  if (!name || !name.trim()) {
    errors.push({ field: "name", message: "Nama wajib diisi" });
  } else if (name.trim().length < 2) {
    errors.push({ field: "name", message: "Nama minimal 2 karakter" });
  } else if (name.trim().length > 100) {
    errors.push({ field: "name", message: "Nama maksimal 100 karakter" });
  } else {
    sanitized.name = DOMPurify.sanitize(name.trim(), { ALLOWED_TAGS: [] });
  }

  if (!email || !email.trim()) {
    errors.push({ field: "email", message: "Email wajib diisi" });
  } else if (!validator.isEmail(email.trim())) {
    errors.push({ field: "email", message: "Format email tidak valid" });
  } else {
    sanitized.email = validator.normalizeEmail(email.trim()) || email.trim();
  }

  if (!password) {
    errors.push({ field: "password", message: "Kata sandi wajib diisi" });
  } else if (password.length < 6) {
    errors.push({ field: "password", message: "Kata sandi minimal 6 karakter" });
  } else if (password.length > 128) {
    errors.push({ field: "password", message: "Kata sandi maksimal 128 karakter" });
  } else {
    sanitized.password = password;
  }

  if (!confirmPassword) {
    errors.push({ field: "confirmPassword", message: "Konfirmasi kata sandi wajib diisi" });
  } else if (password !== confirmPassword) {
    errors.push({ field: "confirmPassword", message: "Konfirmasi kata sandi tidak cocok" });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [] });
}

export function isValidEmail(email: string): boolean {
  return validator.isEmail(email.trim());
}

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[a-zA-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
}