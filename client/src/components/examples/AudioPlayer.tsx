import { useState } from 'react'
import AudioPlayer from '../AudioPlayer'

export default function AudioPlayerExample() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  
  return (
    <div className="p-6">
      <AudioPlayer 
        isPlaying={isPlaying} 
        onPlayPause={() => setIsPlaying(!isPlaying)}
        volume={volume}
        onVolumeChange={setVolume}
        showVolume
      />
    </div>
  )
}
