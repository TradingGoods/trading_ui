export interface Document {
    id: number;
    title: string;
    content: string;
    fileType: string;
    author: string;
    uploadDate: string; // Store as string, format as needed
    metadata: Record<string, string>;
}