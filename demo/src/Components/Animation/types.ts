export type HvProps = {
  loop: boolean;
  speed: number;
  width: number;
  height: number;
  source: string;
  autoPlay: boolean;
  endFrame: number;
  startFrame: number;
  playEventName: string;
  pauseEventName: string;
  resumeEventName: string;
  reverseEventName: string;
  onAnimationFinishEventName: string;
};
