import { useState, useEffect, useCallback } from 'react';

interface MIDIDeviceInfo {
  id: string;
  name: string | null;
  manufacturer: string | null;
  type: 'input' | 'output';
  state: 'connected' | 'disconnected';
}

interface MIDIMessage {
  command: number;
  channel: number;
  note: number;
  velocity: number;
  timestamp: number;
}

interface UseWebMIDIOptions {
  onNoteOn?: (note: number, velocity: number, channel: number) => void;
  onNoteOff?: (note: number, channel: number) => void;
  onControlChange?: (controller: number, value: number, channel: number) => void;
  onMessage?: (message: MIDIMessage) => void;
}

interface UseWebMIDIReturn {
  isSupported: boolean;
  isConnected: boolean;
  inputs: MIDIDeviceInfo[];
  outputs: MIDIDeviceInfo[];
  error: string | null;
  requestAccess: () => Promise<boolean>;
  sendNoteOn: (note: number, velocity: number, channel?: number, outputId?: string) => void;
  sendNoteOff: (note: number, channel?: number, outputId?: string) => void;
  sendControlChange: (controller: number, value: number, channel?: number, outputId?: string) => void;
}

export function useWebMIDI(options: UseWebMIDIOptions = {}): UseWebMIDIReturn {
  const { onNoteOn, onNoteOff, onControlChange, onMessage } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [inputs, setInputs] = useState<MIDIDeviceInfo[]>([]);
  const [outputs, setOutputs] = useState<MIDIDeviceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);

  const isSupported = typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator;

  const mapDevice = (device: MIDIInput | MIDIOutput, type: 'input' | 'output'): MIDIDeviceInfo => ({
    id: device.id,
    name: device.name,
    manufacturer: device.manufacturer,
    type,
    state: device.state as 'connected' | 'disconnected'
  });

  const updateDevices = useCallback((access: MIDIAccess) => {
    const inputDevices: MIDIDeviceInfo[] = [];
    const outputDevices: MIDIDeviceInfo[] = [];

    access.inputs.forEach(input => {
      inputDevices.push(mapDevice(input, 'input'));
    });

    access.outputs.forEach(output => {
      outputDevices.push(mapDevice(output, 'output'));
    });

    setInputs(inputDevices);
    setOutputs(outputDevices);
  }, []);

  const handleMIDIMessage = useCallback((event: MIDIMessageEvent) => {
    const [status, data1, data2] = event.data || [];
    const command = status >> 4;
    const channel = status & 0xf;

    const message: MIDIMessage = {
      command,
      channel,
      note: data1,
      velocity: data2,
      timestamp: event.timeStamp
    };

    onMessage?.(message);

    // Note On (0x9)
    if (command === 9 && data2 > 0) {
      onNoteOn?.(data1, data2, channel);
    }
    // Note Off (0x8) or Note On with velocity 0
    else if (command === 8 || (command === 9 && data2 === 0)) {
      onNoteOff?.(data1, channel);
    }
    // Control Change (0xB)
    else if (command === 11) {
      onControlChange?.(data1, data2, channel);
    }
  }, [onNoteOn, onNoteOff, onControlChange, onMessage]);

  const requestAccess = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Web MIDI API not supported');
      return false;
    }

    try {
      const access = await navigator.requestMIDIAccess();
      setMidiAccess(access);
      setIsConnected(true);
      updateDevices(access);

      // Listen for device changes
      access.onstatechange = () => updateDevices(access);

      // Attach message handlers to all inputs
      access.inputs.forEach(input => {
        input.onmidimessage = handleMIDIMessage;
      });

      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to access MIDI');
      return false;
    }
  }, [isSupported, updateDevices, handleMIDIMessage]);

  const sendMessage = useCallback((message: number[], outputId?: string) => {
    if (!midiAccess) return;

    if (outputId) {
      const output = midiAccess.outputs.get(outputId);
      output?.send(message);
    } else {
      // Send to all outputs
      midiAccess.outputs.forEach(output => {
        output.send(message);
      });
    }
  }, [midiAccess]);

  const sendNoteOn = useCallback((note: number, velocity: number, channel = 0, outputId?: string) => {
    sendMessage([0x90 + channel, note, velocity], outputId);
  }, [sendMessage]);

  const sendNoteOff = useCallback((note: number, channel = 0, outputId?: string) => {
    sendMessage([0x80 + channel, note, 0], outputId);
  }, [sendMessage]);

  const sendControlChange = useCallback((controller: number, value: number, channel = 0, outputId?: string) => {
    sendMessage([0xB0 + channel, controller, value], outputId);
  }, [sendMessage]);

  useEffect(() => {
    return () => {
      if (midiAccess) {
        midiAccess.inputs.forEach(input => {
          input.onmidimessage = null;
        });
      }
    };
  }, [midiAccess]);

  return {
    isSupported,
    isConnected,
    inputs,
    outputs,
    error,
    requestAccess,
    sendNoteOn,
    sendNoteOff,
    sendControlChange
  };
}
