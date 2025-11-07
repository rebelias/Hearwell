import { useState } from 'react'
import WaveformSelector, { WaveformType } from '../WaveformSelector'

export default function WaveformSelectorExample() {
  const [waveform, setWaveform] = useState<WaveformType>('sine')
  
  return (
    <div className="p-6">
      <WaveformSelector value={waveform} onChange={setWaveform} />
      <p className="mt-4 text-sm text-muted-foreground">Selected: {waveform}</p>
    </div>
  )
}
