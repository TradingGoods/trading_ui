import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { Document } from './../model/Document'; // Adjust the import path as necessary
import { CustomHttpService } from '../custom-http-service.service'; // Adjust the import path as necessary

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.css']
})
export class DocumentManagementComponent {

  ingestForm: FormGroup;
    selectedFile: File | null = null;
    searchTerm = '';
    documents: Document[] = [];
    loading = false;
    error: string | null = null;
    authorFilter = '';
    fileTypeFilter = '';
    page = 0;
    pageSize = 5;
    totalElements = 0;
    selectedDocument: Document | null = null;
    uploadSuccess = false;

    private destroy$ = new Subject<void>();

    constructor(private fb: FormBuilder, private customHttpService: CustomHttpService) {
        this.ingestForm = this.fb.group({
            file: [null, Validators.required],
            author: [''],
            documentType: [''],
        });
    }

    ngOnInit(): void {
        this.fetchDocuments();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    formatDate(dateString: string): string {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return 'Invalid Date';
        }
    }

    handleFileChange(event: any): void {
        if (event.target.files && event.target.files[0]) {
            this.selectedFile = event.target.files[0];
            this.ingestForm.patchValue({ file: event.target.files[0] }); // Update form control
        } else {
          this.selectedFile = null;
          this.ingestForm.patchValue({ file: null });
        }
    }

    getObjectKeys(obj: any): string[] {
      return obj ? Object.keys(obj) : [];
    }

    clearFile(): void {
      this.selectedFile = null;
      this.ingestForm.patchValue({ file: null });
    }

    handleIngestDocument(): void {
        if (this.ingestForm.invalid) {
            return;
        }

        this.loading = true;
        this.error = null;
        this.uploadSuccess = false;

        const formData = new FormData();
        formData.append('file', this.ingestForm.get('file')?.value);
        formData.append('author', this.ingestForm.get('author')?.value || '');
        formData.append('documentType', this.ingestForm.get('documentType')?.value || '');
        this.customHttpService.post<Document>(`/documents/ingest`, formData).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result) => {
                    console.log('Document uploaded successfully:', result);
                    this.uploadSuccess = true;
                    this.ingestForm.reset();
                    this.selectedFile = null;
                    this.fetchDocuments();
                },
                error: (error: HttpErrorResponse) => {
                    this.error = error.error.message || 'Failed to upload document.';
                },
                complete: () => {
                    this.loading = false;
                },
            });
    }


    handleSearch(): void {
        this.loading = true;
        this.error = null;
        this.customHttpService.get<Document[]>(`/documents/search?query=${this.searchTerm}`)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => {
                    this.documents = data;
                    this.totalElements = data.length; // For simple search
                    this.page = 0;
                },
                error: (error: HttpErrorResponse) => {
                    this.error = error.error.message || 'Search failed.';
                },
                complete: () => {
                    this.loading = false;
                },
            });
    }


    fetchDocuments(): void {
        this.loading = true;
        this.error = null;

        let params = new HttpParams()
            .set('page', this.page.toString())
            .set('size', this.pageSize.toString());

        if (this.authorFilter) {
            params = params.set('author', this.authorFilter);
        }
        if (this.fileTypeFilter) {
            params = params.set('fileType', this.fileTypeFilter);
        }
        this.customHttpService.get<any>(`/documents/filter`, params)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => {
                    this.documents = data.content;
                    this.totalElements = data.totalElements;
                },
                error: (error: HttpErrorResponse) => {
                    this.error = error.error.message || 'Failed to fetch documents.';
                },
                complete: () => {
                    this.loading = false;
                },
            });
    }

    handlePageChange(newPage: number): void {
        this.page = newPage;
        this.fetchDocuments();
    }

    getPageCount(): number {
        return Math.ceil(this.totalElements / this.pageSize);
    }

    clearFilters(): void {
        this.authorFilter = '';
        this.fileTypeFilter = '';
        this.page = 0;
        this.fetchDocuments();
    }

    handleDocumentClick(document: Document): void {
        this.selectedDocument = document;
    }
}
