import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Assistant from './Assistant';

describe('Assistant Component', () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('renders Assistant header and default greeting', () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByText('VotePath AI Assistant')).toBeInTheDocument();
    expect(screen.getByText(/Namaste! I am VotePath AI/i)).toBeInTheDocument();
  });

  it('allows user to type into the input field', () => {
    renderWithRouter(<Assistant />);
    const input = screen.getByLabelText(/Chat input field/i);
    fireEvent.change(input, { target: { value: 'How to vote?' } });
    expect(input.value).toBe('How to vote?');
  });

  it('renders quick suggestion buttons', () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByText('Lost Voter ID')).toBeInTheDocument();
    expect(screen.getByText('New Registration')).toBeInTheDocument();
  });

  it('has accessible roles and aria labels', () => {
    renderWithRouter(<Assistant />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('log')).toBeInTheDocument();
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });
});
