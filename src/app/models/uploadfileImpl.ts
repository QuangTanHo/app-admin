import { UploadFile } from "./uploadFile";

export class UploadfileImpl   implements UploadFile {
        file: File;
        file_name: string;
        description: string;
        file_directory: string;
        doc_type_id: string;
        type: string;
      
        constructor(
          file: File,
          file_name: string,
          description: string,
          file_directory: string,
          doc_type_id: string,
          type: string
        ) {
          this.file = file;
          this.file_name = file_name;
          this.description = description;
          this.file_directory = file_directory;
          this.doc_type_id = doc_type_id;
          this.type = type;
        }
}
