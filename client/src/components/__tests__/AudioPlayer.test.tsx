import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AudioPlayer from '../AudioPlayer';

describe('AudioPlayer', () => {
  it('should render play button when not playing', () => {
    const onPlayPause = vi.fn();
    render(<AudioPlayer isPlaying={false} onPlayPause={onPlayPause} />);

    const button = screen.getByTestId('button-play-pause');
    expect(button).toBeInTheDocument();
  });

  it('should render pause button when playing', () => {
    const onPlayPause = vi.fn();
    render(<AudioPlayer isPlaying={true} onPlayPause={onPlayPause} />);

    const button = screen.getByTestId('button-play-pause');
    expect(button).toBeInTheDocument();
  });

  it('should call onPlayPause when button is clicked', async () => {
    const user = userEvent.setup();
    const onPlayPause = vi.fn();
    render(<AudioPlayer isPlaying={false} onPlayPause={onPlayPause} />);

    const button = screen.getByTestId('button-play-pause');
    await user.click(button);

    expect(onPlayPause).toHaveBeenCalledTimes(1);
  });

  it('should show volume control when showVolume is true', () => {
    const onPlayPause = vi.fn();
    const onVolumeChange = vi.fn();
    render(
      <AudioPlayer
        isPlaying={false}
        onPlayPause={onPlayPause}
        volume={50}
        onVolumeChange={onVolumeChange}
        showVolume={true}
      />
    );

    const volumeSlider = screen.getByTestId('slider-volume');
    expect(volumeSlider).toBeInTheDocument();
  });

  it('should not show volume control when showVolume is false', () => {
    const onPlayPause = vi.fn();
    render(<AudioPlayer isPlaying={false} onPlayPause={onPlayPause} />);

    const volumeSlider = screen.queryByTestId('slider-volume');
    expect(volumeSlider).not.toBeInTheDocument();
  });

  it('should call onVolumeChange when volume slider changes', async () => {
    const onPlayPause = vi.fn();
    const onVolumeChange = vi.fn();
    render(
      <AudioPlayer
        isPlaying={false}
        onPlayPause={onPlayPause}
        volume={50}
        onVolumeChange={onVolumeChange}
        showVolume={true}
      />
    );

    const volumeSlider = screen.getByTestId('slider-volume');
    fireEvent.change(volumeSlider, { target: { value: '75' } });

    expect(onVolumeChange).toHaveBeenCalledWith(75);
  });
});
