// //handleApiErrors.ts
import { FormInstance, message } from 'antd';
interface ApiError {
    data?: {
        message?: string;
        errors?: {
            [key: string]: string[] | string;
        };
    };
}
export function handleFormErrors(error: ApiError, form: FormInstance): boolean {
  console.log('🔥 handleFormErrors error:', error);

  if (error?.data?.errors) {
    const fieldErrors = Object.entries(error.data.errors).map(([field, messages]) => ({
      name: field.charAt(0).toLowerCase() + field.slice(1),
      errors: Array.isArray(messages) ? messages : [messages],
    }));

    form.setFields(fieldErrors);
    return true; // були field errors
  }

  if (error?.data?.message) {
    message.error(error.data.message);
    let emailError: string[] = [];
    let phoneError: string[] = [];

    if (error.data.message.includes('електронною поштою')) {
      emailError = [error.data.message];
    } else if (error.data.message.includes('номером телефону')) {
      phoneError = [error.data.message];
    }

    form.setFields([
      { name: 'email', errors: emailError },
      { name: 'phone', errors: phoneError },
    ]);

    return true; // теж були field errors
  }

  return false; // нічого не оброблено
}

