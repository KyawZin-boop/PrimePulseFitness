type UploadResponse = {
  message: string;
  status: string; // or use your APIStatus enum type
  data: string; // the file URL
}

type UploadError = {
  message: string;
}