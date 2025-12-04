import React, { useState } from 'react';
import { Volume2, VolumeX, Pause, Play, Settings } from 'lucide-react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TextToSpeechProps {
  text: string;
  className?: string;
  showSettings?: boolean;
  variant?: 'default' | 'compact' | 'icon';
}

export function TextToSpeech({
  text,
  className,
  showSettings = true,
  variant = 'default'
}: TextToSpeechProps) {
  const {
    speak,
    cancel,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    currentVoice,
    setVoice,
    setRate,
    setPitch,
    setVolume
  } = useSpeechSynthesis({ lang: 'de-DE' });

  const [rate, setRateState] = useState(1);
  const [pitch, setPitchState] = useState(1);
  const [volume, setVolumeState] = useState(1);

  if (!isSupported) {
    return null;
  }

  const handleSpeak = () => {
    if (isSpeaking && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      speak(text);
    }
  };

  const handleStop = () => {
    cancel();
  };

  const handleRateChange = (value: number[]) => {
    const newRate = value[0];
    setRateState(newRate);
    setRate(newRate);
  };

  const handlePitchChange = (value: number[]) => {
    const newPitch = value[0];
    setPitchState(newPitch);
    setPitch(newPitch);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  const germanVoices = voices.filter(v => v.lang.startsWith('de'));

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSpeak}
        className={cn('h-8 w-8', className)}
        title={isSpeaking ? 'Pause' : 'Vorlesen'}
      >
        {isSpeaking && !isPaused ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSpeak}
          className="gap-2"
        >
          {isSpeaking && !isPaused ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              Vorlesen
            </>
          )}
        </Button>
        {isSpeaking && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStop}
          >
            <VolumeX className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        onClick={handleSpeak}
        className="gap-2"
      >
        {isSpeaking && !isPaused ? (
          <>
            <Pause className="h-4 w-4" />
            Pause
          </>
        ) : isPaused ? (
          <>
            <Play className="h-4 w-4" />
            Fortsetzen
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            Vorlesen
          </>
        )}
      </Button>

      {isSpeaking && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleStop}
          title="Stop"
        >
          <VolumeX className="h-4 w-4" />
        </Button>
      )}

      {showSettings && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" title="Einstellungen">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Spracheinstellungen</h4>
              
              {/* Voice Selection */}
              {germanVoices.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Stimme</label>
                  <select
                    value={currentVoice?.name || ''}
                    onChange={(e) => {
                      const voice = voices.find(v => v.name === e.target.value);
                      if (voice) setVoice(voice);
                    }}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    {germanVoices.map(voice => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Rate */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-muted-foreground">Geschwindigkeit</label>
                  <span className="text-sm">{rate.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[rate]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={handleRateChange}
                />
              </div>

              {/* Pitch */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-muted-foreground">Tonhöhe</label>
                  <span className="text-sm">{pitch.toFixed(1)}</span>
                </div>
                <Slider
                  value={[pitch]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={handlePitchChange}
                />
              </div>

              {/* Volume */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-muted-foreground">Lautstärke</label>
                  <span className="text-sm">{Math.round(volume * 100)}%</span>
                </div>
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
