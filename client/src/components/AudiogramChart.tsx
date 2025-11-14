import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';

interface AudiogramChartProps {
  testResults: Record<
    string,
    'untested' | 'playing' | 'played' | 'heard' | 'not_heard'
  >;
  frequencies: number[];
  volumes: number[];
}

export default function AudiogramChart({
  testResults,
  frequencies,
  volumes,
}: AudiogramChartProps) {
  const { t } = useTranslation(['audiometer', 'common']);
  const getLowestHeardVolume = (freq: number): number | null => {
    // Find the lowest (quietest) volume where user marked as "heard"
    for (const vol of volumes) {
      const key = `${freq}-${vol}`;
      if (testResults[key] === 'heard') {
        return vol;
      }
    }

    // If nothing was heard, check if frequency was tested at all
    // If tested but nothing heard, return the highest tested volume + 10dB (or 100dB max)
    // This indicates hearing loss at that frequency
    let highestTestedVolume = -1;
    for (const vol of volumes) {
      const key = `${freq}-${vol}`;
      const state = testResults[key];
      if (state === 'played' || state === 'not_heard' || state === 'heard') {
        highestTestedVolume = Math.max(highestTestedVolume, vol);
      }
    }

    // If frequency was tested but nothing heard, show threshold above highest tested volume
    if (highestTestedVolume >= 0) {
      // Check if all tested volumes were marked as "not_heard"
      let allNotHeard = true;
      for (const vol of volumes) {
        const key = `${freq}-${vol}`;
        if (testResults[key] === 'heard') {
          allNotHeard = false;
          break;
        }
      }

      if (allNotHeard && highestTestedVolume >= 0) {
        // Return the highest tested volume + 10dB, capped at 100dB
        return Math.min(highestTestedVolume + 10, 100);
      }
    }

    return null;
  };

  // Include all frequencies in chart data, even if not heard
  const chartData = frequencies.map(freq => {
    const volume = getLowestHeardVolume(freq);
    return {
      frequency: freq,
      threshold: volume,
    };
  });

  const hasResults = chartData.some(point => point.threshold !== null);

  if (!hasResults) {
    return (
      <div className="h-64 bg-muted/30 rounded-lg flex flex-col items-center justify-center space-y-2 p-4">
        <p className="text-muted-foreground text-center font-medium">
          {t('audiometer:noResultsYet', 'No results yet')}
        </p>
        <p className="text-muted-foreground text-xs text-center">
          {t(
            'audiometer:startTestingInstructions',
            'Start testing by clicking the ▶ Play button on cells. When you hear a sound, click the ✓ Heard button to mark it. Your hearing threshold will appear here automatically.'
          )}
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="frequency"
          label={{
            value: t('audiometer:frequencyHz'),
            position: 'insideBottom',
            offset: -5,
          }}
          className="text-xs"
          type="number"
          scale="log"
          domain={[
            Math.min(...frequencies) * 0.9,
            Math.max(...frequencies) * 1.1,
          ]}
          ticks={frequencies}
          tickFormatter={value => {
            if (value >= 1000) {
              return `${value / 1000}k`;
            }
            return value.toString();
          }}
        />
        <YAxis
          reversed
          label={{
            value: t('audiometer:hearingLevel'),
            angle: -90,
            position: 'insideLeft',
          }}
          domain={[-10, 100]}
          className="text-xs"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
          formatter={(value: number) => [
            `${value} dB`,
            t('audiometer:threshold', 'Threshold'),
          ]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="threshold"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={(props: {
            cx?: number;
            cy?: number;
            payload?: { threshold: number | null };
          }) => {
            // Only show dot if there's a threshold value
            if (
              props.payload?.threshold !== null &&
              props.cx !== undefined &&
              props.cy !== undefined
            ) {
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={4}
                  fill="hsl(var(--primary))"
                />
              );
            }
            return null;
          }}
          activeDot={{ r: 6 }}
          name={t('audiometer:hearingThreshold', 'Hearing Threshold')}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
