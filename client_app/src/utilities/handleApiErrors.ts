// // src/utilities/handleApiErrors.ts
// import { FormInstance, message } from 'antd';
//
// interface ApiError {
//     data?: {
//         message?: string;
//         errors?: {
//             [key: string]: string[] | string;
//         };
//     };
// }
//
// export function handleFormErrors(error: ApiError, form: FormInstance) {
//     if (error?.data?.errors) {
//         const fieldErrors = Object.entries(error.data.errors).map(([field, messages]) => ({
//             name: field,
//             errors: Array.isArray(messages) ? messages : [messages],
//         }));
//
//         form.setFields(fieldErrors);
//     }
//
//     if (error?.data?.message) {
//         message.error(error.data.message);
// console.log(error.data.message)    }
// }

// import { FormInstance, message } from 'antd';
//
// interface ApiError {
//     data?: {
//         message?: string;
//         errors?: {
//             [key: string]: string[] | string;
//         };
//     };
// }
//
// export function handleFormErrors(error: ApiError, form: FormInstance) {
//     console.log('🔥 handleFormErrors error:', error);
//
//     // if (error?.data?.errors) {
//     //     const fieldErrors = Object.entries(error.data.errors).map(([field, messages]) => ({
//     //         name: field, // ОБОВ'ЯЗКОВО масив
//     //         errors: Array.isArray(messages) ? messages : [messages],
//     //     }));
//     //     console.log(fieldErrors);
//     //
//     //     form.setFields(fieldErrors); // показати помилки під полями
//     // }
//     if (error?.data?.errors) {
//         const fieldErrors = Object.entries(error.data.errors).map(([field, messages]) => ({
//             name: field.charAt(0).toLowerCase() + field.slice(1), // робимо першу букву маленькою
//             errors: Array.isArray(messages) ? messages : [messages],
//         }));
//         console.log(fieldErrors);
//
//         form.setFields(fieldErrors); // показати помилки під полями
//     }
//
//     // if (error?.data?.message) {
//     //     message.error(error.data.message); // глобальна помилка
//     //     form.setFields([
//     //         {
//     //             name: 'email',
//     //             errors: [error.data.message],  // повідомлення під email
//     //         },
//     //
//     //
//     //     ]);
//     //     console.log('📣 API message:', error.data.message);
//     // }
//
//     if (error?.data?.message) {
//         message.error(error.data.message); // глобальна помилка
//
//         // Залежно від тексту помилки ставимо під відповідне поле
//         let emailError = [];
//         let phoneError = [];
//
//         if (error.data.message.includes('електронною поштою')) {
//             emailError = [error.data.message];
//         } else if (error.data.message.includes('номером телефону')) {
//             phoneError = [error.data.message];
//         }
//
//         form.setFields([
//             {
//                 name: 'email',
//                 errors: emailError,
//             },
//             {
//                 name: 'phoneNumber', // ім'я поля для телефону в формі
//                 errors: phoneError,
//             }
//         ]);
//     }
//
// }


import { FormInstance, message } from 'antd';

interface ApiError {
    data?: {
        message?: string;
        errors?: {
            [key: string]: string[] | string;
        };
    };
}

export function handleFormErrors(error: ApiError, form: FormInstance) {
    console.log('🔥 handleFormErrors error:', error);

    if (error?.data?.errors) {
        const fieldErrors = Object.entries(error.data.errors).map(([field, messages]) => ({
            name: field.charAt(0).toLowerCase() + field.slice(1), // з малої букви
            errors: Array.isArray(messages) ? messages : [messages],
        }));

        form.setFields(fieldErrors);
        return; // якщо є field errors, можна завершити функцію
    }

    if (error?.data?.message) {
        message.error(error.data.message); // глобальна помилка

        let emailError: string[] = [];
        let phoneError: string[] = [];

        if (error.data.message.includes('електронною поштою')) {
            emailError = [error.data.message];
        } else if (error.data.message.includes('номером телефону')) {
            phoneError = [error.data.message];
        }

        form.setFields([
            {
                name: 'email',
                errors: emailError,
            },
            {
                name: 'phone',
                errors: phoneError,
            },
        ]);
    }
}
