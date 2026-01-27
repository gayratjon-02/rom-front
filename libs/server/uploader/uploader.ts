
import {
    API_URL_NEXT, AuthApiError,
} from '@/libs/components/types/config';
import { getAuthToken } from '@/libs/server/HomePage/signup';
import { UploadImageResponse, UploadProgress } from '@/libs/types/uploader/uploader.input';

// API Configuration
const API_URL = API_URL_NEXT;
const API_BASE = `${API_URL}/api`;


export async function uploadImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadImageResponse> {
    const token = getAuthToken();

    if (!token) {
        throw new AuthApiError(401, ['Authentication required. Please login.'], {
            statusCode: 401,
            error: 'Unauthorized',
            message: ['Authentication required'],
        });
    }

    // Use XMLHttpRequest for progress tracking
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();

        // Progress event
        if (onProgress) {
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    onProgress({
                        loaded: event.loaded,
                        total: event.total,
                        percentage: Math.round((event.loaded / event.total) * 100),
                    });
                }
            });
        }

        // Load event
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response as UploadImageResponse);
                } catch (e) {
                    reject(
                        new AuthApiError(500, ['Failed to parse response'], {
                            statusCode: 500,
                            error: 'Parse Error',
                            message: ['Failed to parse response'],
                        })
                    );
                }
            } else {
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    reject(
                        new AuthApiError(xhr.status, [errorData.message || 'Upload failed'], {
                            statusCode: xhr.status,
                            error: 'Upload Error',
                            message: [errorData.message || 'Upload failed'],
                        })
                    );
                } catch (e) {
                    reject(
                        new AuthApiError(xhr.status, [`Upload failed with status ${xhr.status}`], {
                            statusCode: xhr.status,
                            error: 'Upload Error',
                            message: [`Upload failed with status ${xhr.status}`],
                        })
                    );
                }
            }
        });

        // Error event
        xhr.addEventListener('error', () => {
            reject(
                new AuthApiError(0, ['Network error during upload'], {
                    statusCode: 0,
                    error: 'Network Error',
                    message: ['Network error during upload'],
                })
            );
        });

        // Abort event
        xhr.addEventListener('abort', () => {
            reject(
                new AuthApiError(0, ['Upload cancelled'], {
                    statusCode: 0,
                    error: 'Aborted',
                    message: ['Upload cancelled'],
                })
            );
        });

        // Open and send
        xhr.open('POST', `${API_BASE}/files/uploadImage`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
    });
}

export async function uploadImageSimple(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const token = getAuthToken();

    if (!token) {
        throw new AuthApiError(401, ['Authentication required. Please login.'], {
            statusCode: 401,
            error: 'Unauthorized',
            message: ['Authentication required'],
        });
    }

    const response = await fetch(`${API_BASE}/files/uploadImage`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new AuthApiError(response.status, [data.message || 'Upload failed'], {
            statusCode: response.status,
            error: 'Upload Error',
            message: [data.message || 'Upload failed'],
        });
    }

    return data as UploadImageResponse;
}

export async function uploadDAImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<string> {
    const result = await uploadImage(file, onProgress);
    return result.url;
}


export async function uploadProductImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadImageResponse> {
    return uploadImage(file, onProgress);
}


export function validateImageFile(
    file: File,
    maxSizeMB: number = 10
): { isValid: boolean; error?: string } {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        return {
            isValid: false,
            error: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF.',
        };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return {
            isValid: false,
            error: `File too large. Maximum size is ${maxSizeMB}MB.`,
        };
    }

    return { isValid: true };
}

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}
