export function base64ToFile(base64: string, filename: string): File {
    // Розділяємо Base64 рядок на частину без префікса (якщо він є)
    const [prefix, base64Data] = base64.split(',');
    
    // Визначаємо тип MIME (можна отримати з префікса, або передати явно)
    const mimeType = prefix.match(/:(.*?);/)?.[1] || 'application/octet-stream'; 

    // Перетворюємо Base64 рядок на масив байтів
    const byteCharacters = atob(base64Data);

    // Створюємо масив байтів
    const byteArrays = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
    }

    // Створюємо об'єкт File
    const file = new File([byteArrays], filename, { type: mimeType });
    return file;
}