import { Upload } from 'antd';
import { showToast } from './showToast';

export const validateImageBeforeUpload = (file: File): boolean | typeof Upload.LIST_IGNORE => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        showToast('error', 'Можна завантажувати лише зображення!');
        return Upload.LIST_IGNORE;
    }

    const is5MB = file.size / 1024 / 1024 < 5;
    if (!is5MB) {
        showToast('error', 'Розмір зображення не має перевищувати 5MB!');
        return Upload.LIST_IGNORE;
    }

    return false; 
};
