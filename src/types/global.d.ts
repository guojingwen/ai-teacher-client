declare interface Window {
  getUserMedia: any;
  _voiceOpened: boolean;
  needTokenFn: Function | null;
  needOpenVoice: Function | null;
  wx: Wx;
  wxPromise: Promise<any>;
  isVoiceGrantPrivilege: boolean;
}

declare interface Wx {
  [key: string]: any;
}
