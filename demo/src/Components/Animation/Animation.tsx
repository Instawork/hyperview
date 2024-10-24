import type { HvComponentProps, LocalName } from 'hyperview';
import Hyperview, { Events } from 'hyperview';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { AnimationObject } from 'lottie-react-native';
import type { ElementRef } from 'react';
import type { HvProps } from './types';
import LottieView from 'lottie-react-native';
import { decode } from 'base-64';
import urlParse from 'url-parse';

const LOADER_TAG = 'loading';
const FALLBACK_TAG = 'fallback';
const namespaceURI = 'https://hyperview.org/animation';

const isValidBase64 = (input: string): boolean => {
  if (typeof input !== 'string' || !input) {
    return false;
  }

  const pattern = new RegExp(
    '^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$',
  );
  return !!pattern.test(input);
};

const Animation = (props: HvComponentProps) => {
  const rawProps = Hyperview.createProps(
    props.element,
    props.stylesheets,
    props.options,
  );

  const hvProps: HvProps = {
    autoPlay: rawProps['auto-play'] === 'true',
    endFrame: parseInt(rawProps['end-frame'], 10) || -1,
    height: parseFloat(rawProps.height) || 0,
    loop: rawProps.loop === 'true',
    onAnimationFinishEventName: rawProps['on-animation-finish-event-name'],
    pauseEventName: rawProps['pause-event-name'],
    playEventName: rawProps['play-event-name'],
    resumeEventName: rawProps['resume-event-name'],
    reverseEventName: rawProps['reverse-event-name'],
    source: rawProps.source,
    speed: parseFloat(rawProps.speed) || 1,
    startFrame: parseInt(rawProps['start-frame'], 10) || -1,
    width: parseFloat(rawProps.width) || 0,
  };

  const [errored, setErrored] = useState(false);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<AnimationObject | null>(null);
  const [startFrame, setStartFrame] = useState<number>(-1);
  const [endFrame, setEndFrame] = useState<number>(-1);
  const [speed, setSpeed] = useState(hvProps.speed);
  const [reverse, setReverse] = useState(false);
  const ref = useRef<ElementRef<typeof LottieView>>(null);

  const onAnimationFinish = (isCancelled: boolean) => {
    if (reverse && !isCancelled) {
      ref?.current?.reset();
      setReverse(false);
      setSpeed(hvProps.speed);
    }

    if (hvProps.onAnimationFinishEventName) {
      Events.dispatch(hvProps.onAnimationFinishEventName);
    }
  };

  const playAnimation = useCallback(() => {
    if (speed < 0) {
      setReverse(false);
      setSpeed(hvProps.speed);
    }
    ref?.current?.play(startFrame, endFrame);
  }, [endFrame, hvProps.speed, startFrame, speed]);

  const reverseAnimation = useCallback(() => {
    setReverse(true);
    playAnimation();
  }, [playAnimation]);

  useEffect(() => {
    const onHyperviewEventDispatch = (eventName: string) => {
      if (loading) {
        return;
      }

      if (eventName === hvProps.playEventName) {
        playAnimation();
      } else if (eventName === hvProps.pauseEventName) {
        ref?.current?.pause();
      } else if (eventName === hvProps.reverseEventName) {
        reverseAnimation();
      } else if (eventName === hvProps.resumeEventName) {
        if (reverse) {
          setSpeed(-hvProps.speed);
        }
        ref?.current?.resume();
      }
    };
    const getSource = async (): Promise<AnimationObject | null> => {
      if (isValidBase64(hvProps.source)) {
        try {
          return JSON.parse(decode(hvProps.source));
        } catch (error) {
          return null;
        }
      }
      try {
        const assetUrl = urlParse(
          hvProps.source,
          props.options.screenUrl,
          true,
        ).toString();
        const res = await fetch(assetUrl);
        return res.json();
      } catch (error) {
        return null;
      }
    };
    const updateSource = async () => {
      setLoading(true);
      const s = await getSource();
      setSource(s);
      setStartFrame(s?.ip || hvProps.startFrame);
      setEndFrame(s?.op || hvProps.endFrame);
      setLoading(false);
    };
    const onMount = async () => {
      try {
        Events.subscribe(onHyperviewEventDispatch);
        await updateSource();
      } catch (error) {
        setErrored(true);
        setLoading(false);
      }
    };
    onMount();
    return () => {
      Events.unsubscribe(onHyperviewEventDispatch);
    };
  }, [
    endFrame,
    hvProps.endFrame,
    hvProps.pauseEventName,
    hvProps.playEventName,
    hvProps.resumeEventName,
    hvProps.reverseEventName,
    hvProps.source,
    hvProps.speed,
    hvProps.startFrame,
    loading,
    props.options.screenUrl,
    reverse,
    speed,
    startFrame,
    playAnimation,
    reverseAnimation,
  ]);

  useEffect(() => {
    if (ref.current && !loading && !errored && hvProps.autoPlay) {
      playAnimation();
    }
  }, [loading, errored, hvProps.autoPlay, playAnimation]);

  const renderElement = (tagName: string) => {
    const [element] = Array.from(
      props.element.getElementsByTagNameNS(namespaceURI, tagName),
    );

    return element
      ? Hyperview.renderChildren(
          element,
          props.stylesheets,
          props.onUpdate,
          props.options,
        )
      : null;
  };

  if (loading) {
    return renderElement(LOADER_TAG);
  }

  if (errored) {
    return renderElement(FALLBACK_TAG);
  }

  return source ? (
    <LottieView
      ref={ref}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore 2332: height is not defined on LottieView's types but is needed
      height={hvProps.height}
      loop={hvProps.loop}
      onAnimationFinish={onAnimationFinish}
      source={source}
      speed={speed}
      width={hvProps.width}
    />
  ) : null;
};

Animation.namespaceURI = namespaceURI;

Animation.localNameAliases = [] as LocalName[];

Animation.localName = 'animation';

export { Animation };
