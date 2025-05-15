export interface Document {
    id: number;
    title: string;
    content: string;
    fileType: string;
    author: string;
    uploadDate: string;
    metadata: Record<string, string>;
}