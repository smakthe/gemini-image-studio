export enum AppMode {
  EDIT = 'edit',
  TIME_TRAVEL = 'time_travel',
  GENERATE = 'generate',
}

export interface UploadedImage {
  file: File;
  base64: string;
  mimeType: string;
}

export interface ModeConfig {
  title: string;
  placeholder: string;
  examples: string[];
}
