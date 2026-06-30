import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from '../Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input value="" onChange={vi.fn()} label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders without label when not provided', () => {
    const { container } = render(<Input value="" onChange={vi.fn()} />);
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('shows placeholder text', () => {
    render(<Input value="" onChange={vi.fn()} placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('calls onChange with new value', () => {
    const onChange = vi.fn();
    render(<Input value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test@gmail.com' } });
    expect(onChange).toHaveBeenCalledWith('test@gmail.com');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input value="" onChange={vi.fn()} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('has disabled styles when disabled', () => {
    render(<Input value="" onChange={vi.fn()} disabled />);
    expect(screen.getByRole('textbox')).toHaveClass('disabled:opacity-50');
  });

  it('calls onKeyPress on key events', () => {
    const onKeyPress = vi.fn();
    render(<Input value="" onChange={vi.fn()} onKeyPress={onKeyPress} />);
    fireEvent.keyPress(screen.getByRole('textbox'), { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(onKeyPress).toHaveBeenCalled();
  });

  it('displays current value', () => {
    render(<Input value="hello" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });

  it('renders email type input correctly', () => {
    render(<Input type="email" value="a@b.com" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('a@b.com')).toHaveAttribute('type', 'email');
  });
});
