export type GameSound =
  | "start"
  | "hit"
  | "combo"
  | "critical"
  | "auto"
  | "bomb"
  | "clear"
  | "skill"
  | "coin"
  | "error"
  | "toggle";

const SOUND_STORAGE_KEY = "baibai:sound-enabled";

let audioContext: AudioContext | null = null;

export function getSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(SOUND_STORAGE_KEY) !== "false";
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    audioContext ??= new AudioContext();
    if (audioContext.state === "suspended") {
      void audioContext.resume().catch(() => undefined);
    }
    return audioContext;
  } catch {
    return null;
  }
}

function tone(
  context: AudioContext,
  startAt: number,
  frequency: number,
  endFrequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = "triangle",
): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(endFrequency, 1), startAt + duration);
  gain.gain.setValueAtTime(0.001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.01);
}

function noise(context: AudioContext, startAt: number, duration: number, volume: number): void {
  const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = (Math.random() * 2 - 1) * (1 - index / channel.length);
  }
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = buffer;
  filter.type = "lowpass";
  filter.frequency.value = 800;
  gain.gain.setValueAtTime(volume, startAt);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  source.connect(filter).connect(gain).connect(context.destination);
  source.start(startAt);
}

export function playGameSound(sound: GameSound): void {
  if (!getSoundEnabled()) return;
  const context = getAudioContext();
  if (!context) return;
  const now = context.currentTime + 0.006;

  switch (sound) {
    case "start":
      tone(context, now, 260, 440, 0.11, 0.07);
      tone(context, now + 0.07, 420, 680, 0.14, 0.06);
      return;
    case "hit":
      tone(context, now, 210, 110, 0.055, 0.06, "square");
      return;
    case "combo":
      tone(context, now, 300, 470, 0.065, 0.07);
      tone(context, now + 0.045, 470, 700, 0.095, 0.07);
      return;
    case "critical":
      tone(context, now, 760, 420, 0.12, 0.09, "square");
      tone(context, now + 0.035, 1120, 820, 0.14, 0.07);
      return;
    case "auto":
      tone(context, now, 150, 105, 0.04, 0.025);
      return;
    case "bomb":
      noise(context, now, 0.24, 0.12);
      tone(context, now, 150, 38, 0.28, 0.12, "sawtooth");
      return;
    case "clear":
      tone(context, now, 390, 520, 0.12, 0.08);
      tone(context, now + 0.1, 520, 700, 0.13, 0.08);
      tone(context, now + 0.21, 700, 1040, 0.22, 0.09);
      return;
    case "skill":
      tone(context, now, 560, 850, 0.12, 0.07);
      tone(context, now + 0.09, 850, 1260, 0.18, 0.075);
      return;
    case "coin":
      tone(context, now, 820, 980, 0.08, 0.065);
      tone(context, now + 0.075, 1120, 1380, 0.11, 0.065);
      return;
    case "error":
      tone(context, now, 210, 145, 0.15, 0.055, "sawtooth");
      return;
    case "toggle":
      tone(context, now, 420, 620, 0.09, 0.045);
  }
}
