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
