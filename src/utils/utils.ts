import { Message } from '@/types';

export function getUrlParams(search: string) {
  return search
    .substring(1)
    .split('&')
    .reduce(
      (sum, it) => {
        const [key, val = ''] = it.split('=');
        sum[key] = val;
        return sum;
      },
      {} as { [key: string]: string }
    );
}

class AudioPlayImpl<T extends object = {}> {
  protected audioElement: HTMLAudioElement;
  protected addition: T | null | undefined = null;
  protected cb: Function | null | undefined = null;
  public constructor() {
    this.audioElement = new Audio();
    this.audioElement.addEventListener('ended', () => this.ended());
  }
  play(src: string, addition?: T, cb?: Function) {
    this.audioElement.src = src;
    this.addition = addition;
    this.cb = cb;
    this.audioElement.play();
  }
  private ended() {
    this.cb?.(this.addition);
    this.addition = null;
    this.cb = null;
  }
  stop() {
    this.audioElement.currentTime = 0;
    this.audioElement.pause();
    this.addition = null;
    this.cb = null;
  }
  getAddi(): T | null | undefined {
    return this.addition;
  }
}

export const audioInst = new AudioPlayImpl<
  Message & { index: number }
>();
