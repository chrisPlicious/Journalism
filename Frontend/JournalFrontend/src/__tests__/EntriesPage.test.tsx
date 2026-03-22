import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock the API module
const mockGetJournals = vi.fn();
vi.mock('../services/api', () => ({
  getJournals: (...args: unknown[]) => mockGetJournals(...args),
  deleteJournal: vi.fn(),
  getJournalById: vi.fn(),
  journalFavorite: vi.fn(),
  journalPin: vi.fn(),
  getProfile: vi.fn().mockResolvedValue({ avatarUrl: '/avatar/test.png' }),
}));

// Mock the AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    token: 'test-token',
    username: 'TestUser',
    isAuthenticated: true,
    email: 'test@test.com',
    avatarUrl: null,
    login: vi.fn(),
    logout: vi.fn(),
    updateAvatar: vi.fn(),
    updateUsername: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the theme context
vi.mock('../context/themeContext', () => ({
  useTheme: () => ({
    theme: 'dark',
    toggleTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
  Toaster: () => null,
}));

import EntriesPage from '../pages/EntriesPage';
import type { JournalEntryDto } from '../models/journal';

describe('EntriesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders journal cards from mock data', async () => {
    const mockEntries: JournalEntryDto[] = [
      {
        id: 1,
        title: 'My First Journal',
        category: 'personal',
        content: 'This is my first entry',
        createdAt: '2026-01-15T00:00:00Z',
        isPinned: false,
        isFavorite: false,
      },
      {
        id: 2,
        title: 'Work Notes',
        category: 'work',
        content: 'Important work notes',
        createdAt: '2026-01-16T00:00:00Z',
        isPinned: true,
        isFavorite: true,
      },
    ];

    mockGetJournals.mockResolvedValue(mockEntries);

    render(
      <MemoryRouter>
        <EntriesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('My First Journal')).toBeInTheDocument();
    });

    expect(screen.getByText('Work Notes')).toBeInTheDocument();
    expect(screen.getByText('personal')).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
  });

  it('shows empty state when no entries exist', async () => {
    mockGetJournals.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <EntriesPage />
      </MemoryRouter>
    );

    // Updated: the component now shows "No entries yet" for empty journal list
    await waitFor(() => {
      expect(screen.getByText('No entries yet')).toBeInTheDocument();
    });
  });

  it('displays the username in the heading', async () => {
    mockGetJournals.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <EntriesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("TestUser's Journal Entries")).toBeInTheDocument();
    });
  });
});
