export interface JournalEntryCreateDto {
  title: string;
  category: string;
  content: string;
}

export interface JournalEntryDto {
  id: number;
  title: string;
  category: string;
  content: string;
  createdAt: string; // ISO date string from backend
  isPinned: boolean;
  isFavorite: boolean;
}

export interface JournalEntryDetailDto {
  id: number;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
