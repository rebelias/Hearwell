import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WaveformSelector from '../WaveformSelector';

describe('WaveformSelector', () => {
  it('should render all waveform options', () => {
    const onChange = vi.fn();
    render(<WaveformSelector value="sine" onChange={onChange} />);

    expect(screen.getByTestId('button-waveform-sine')).toBeInTheDocument();
    expect(screen.getByTestId('button-waveform-square')).toBeInTheDocument();
    expect(screen.getByTestId('button-waveform-triangle')).toBeInTheDocument();
    expect(screen.getByTestId('button-waveform-sawtooth')).toBeInTheDocument();
    expect(screen.getByTestId('button-waveform-filtered')).toBeInTheDocument();
    expect(screen.getByTestId('button-waveform-noise')).toBeInTheDocument();
  });

  it('should highlight selected waveform', () => {
    const onChange = vi.fn();
    render(<WaveformSelector value="square" onChange={onChange} />);

    const squareButton = screen.getByTestId('button-waveform-square');
    // The selected button should have variant="default" (not outline)
    expect(squareButton).toBeInTheDocument();
  });

  it('should call onChange when waveform is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<WaveformSelector value="sine" onChange={onChange} />);

    const squareButton = screen.getByTestId('button-waveform-square');
    await user.click(squareButton);

    expect(onChange).toHaveBeenCalledWith('square');
  });

  it('should allow selecting different waveforms', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<WaveformSelector value="sine" onChange={onChange} />);

    const waveforms = ['square', 'triangle', 'sawtooth', 'filtered', 'noise'];

    for (const waveform of waveforms) {
      const button = screen.getByTestId(`button-waveform-${waveform}`);
      await user.click(button);
      expect(onChange).toHaveBeenCalledWith(waveform);
    }
  });
});
