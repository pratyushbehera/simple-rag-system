export const SUPPORTED_EXTENSIONS = [
  ".txt",
  ".md",
  ".pdf",
  ".docx",
  ".pptx",
] as const;

export type SupportedExtension = (typeof SUPPORTED_EXTENSIONS)[number];
