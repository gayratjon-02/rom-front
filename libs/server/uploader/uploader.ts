/**
 * File Upload API
 * Frontend integration for backend files controller
 */

import { API_BASE, getAuthHeaders, AuthApiError } from '@/libs/components/types/config';

// Types
export interface UploadImageResponse {
    filename: string;
    mimetype: string;
    size: number;
    path: string;
    url: string;
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

/**
 * Upload a single image file
 * @param file - The file to upload
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with upload result containing URL
 */
export async function uploadImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadImageResponse> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        // Get auth token
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (!token) {
            throw new AuthApiError(['Authentication required. Please login.']);
        }

        // Use XMLHttpRequest for progress tracking
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Progress event
            if (onProgress) {
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        onProgress({
                            loaded: event.loaded,
                            total: event.total,
                            percentage: Math.round((event.loaded / event.total) * 100)
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
                        reject(new Error('Failed to parse response'));
                    }
                } else {
                    try {
                        const errorData = JSON.parse(xhr.responseText);
                        reject(new AuthApiError([errorData.message || 'Upload failed']));
                    } catch (e) {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                }
            });

            // Error event
            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            // Abort event
            xhr.addEventListener('abort', () => {
                reject(new Error('Upload cancelled'));
            });

            // Open and send
            xhr.open('POST', `${API_BASE}/files/uploadImage`);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(formData);
        });
    } catch (error) {
        if (error instanceof AuthApiError) {
            throw error;
        }
        throw new AuthApiError(['Failed to upload image. Please try again.']);
    }
}

/**
 * Upload image without progress tracking (simpler version)
 * @param file - The file to upload
 * @returns Promise with upload result
 */
export async function uploadImageSimple(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
        throw new AuthApiError(['Authentication required. Please login.']);
    }

    const response = await fetch(`${API_BASE}/files/uploadImage`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new AuthApiError([data.message || 'Upload failed']);
    }

    return data as UploadImageResponse;
}

/**
 * Upload DA reference image for collection
 * @param file - The DA reference image
 * @param onProgress - Optional progress callback
 * @returns Promise with URL of uploaded image
 */
export async function uploadDAImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<string> {
    const result = await uploadImage(file, onProgress);
    return result.url;
}

/**
 * Upload product image
 * @param file - The product image
 * @param onProgress - Optional progress callback
 * @returns Promise with upload result
 */
export async function uploadProductImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadImageResponse> {
    return uploadImage(file, onProgress);
}

/**
 * Validate image file before upload
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10)
 * @returns Object with isValid and error message
 */
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

/**
 * Convert File to base64 string
 * @param file - The file to convert
 * @returns Promise with base64 string
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}
