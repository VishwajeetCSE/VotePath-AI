import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');

describe('Dashboard Component', () => {
  const mockCandidates = [
    { id: '1', name: 'Test Candidate', party: 'TEST', region: 'Test Region', description: 'Test Description' }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { success: true, data: mockCandidates } });
  });

  const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

  it('renders Dashboard header correctly', async () => {
    renderWithRouter(<Dashboard />);
    expect(await screen.findByText('Election')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders ruling party section', async () => {
    renderWithRouter(<Dashboard />);
    expect(await screen.findByText('National Democratic Alliance (NDA)')).toBeInTheDocument();
  });

  it('renders candidate data', async () => {
    renderWithRouter(<Dashboard />);
    expect(await screen.findByText('Test Candidate')).toBeInTheDocument();
    expect(screen.getByText('TEST')).toBeInTheDocument();
    expect(screen.getByText('Test Region')).toBeInTheDocument();
  });

  it('has accessible roles and aria labels', async () => {
    renderWithRouter(<Dashboard />);
    expect(await screen.findByRole('main')).toBeInTheDocument();
  });
});
