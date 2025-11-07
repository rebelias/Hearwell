import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AudiogramChartProps {
  testResults: Record<string, 'untested' | 'playing' | 'tested'>;
  frequencies: number[];
  volumes: number[];
}

export default function AudiogramChart({ testResults, frequencies, volumes }: AudiogramChartProps) {
  const getLowestTestedVolume = (freq: number): number | null => {
    for (const vol of volumes) {
      const key = `${freq}-${vol}`;
      if (testResults[key] === 'tested') {
        return vol;
      }
    }
    return null;
  };

  const chartData = frequencies.map(freq => {
    const volume = getLowestTestedVolume(freq);
    return {
      frequency: freq,
      threshold: volume,
    };
  }).filter(point => point.threshold !== null);

  if (chartData.length === 0) {
    return (
      <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Complete hearing tests to see your audiogram</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis 
          dataKey="frequency" 
          label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5 }}
          className="text-xs"
        />
        <YAxis 
          reversed
          label={{ value: 'Hearing Level (dB)', angle: -90, position: 'insideLeft' }}
          domain={[-10, 100]}
          className="text-xs"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem'
          }}
          formatter={(value: number) => [`${value} dB`, 'Threshold']}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="threshold" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))', r: 4 }}
          activeDot={{ r: 6 }}
          name="Hearing Threshold"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
