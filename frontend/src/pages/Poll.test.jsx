import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Poll from './Poll';
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');

// Mock recharts to avoid rendering issues in jsdom
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: () => <div>Bar</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
  Cell: () => <div>Cell</div>,
}));

// Mock reCAPTCHA
vi.mock('react-google-recaptcha-v3', () => ({
  __esModule: true,
  GoogleReCaptcha: () => <div>Mocked ReCAPTCHA</div>
}));

describe('Poll Component', () => {
  const mockStandings = [
    { id: 'bjp', name: 'Bharatiya Janata Party (BJP)', votes: 10, percentage: '100.0' }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { success: true, data: { parties: mockStandings, totalVotes: 10 } } });
  });

  const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

  it('renders Poll header and description', async () => {
    renderWithRouter(<Poll />);
    expect(await screen.findByText(/Live Political Poll/i)).toBeInTheDocument();
  });

  it('renders party options', async () => {
    renderWithRouter(<Poll />);
    expect(await screen.findByText('Bharatiya Janata Party (BJP)')).toBeInTheDocument();
  });

  it('renders the submit button', async () => {
    renderWithRouter(<Poll />);
    expect(await screen.findByRole('button', { name: /Submit Secure Vote/i })).toBeInTheDocument();
  });

  it('has accessible roles and aria labels', async () => {
    renderWithRouter(<Poll />);
    expect(await screen.findByRole('main')).toBeInTheDocument();
    expect(await screen.findByRole('radiogroup')).toBeInTheDocument();
  });
});
