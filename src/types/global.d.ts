declare interface Window {
  getUserMedia: any;
  _voiceOpened: boolean;
  needTokenFn: Function | null;
  needOpenVoice: Function | null;
}
