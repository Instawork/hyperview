const dragUpHelper = (
  _stopPointLocations: (number | null)[],
  screenHeight: number,
  translateY: number,
): number => {
  'worklet';

  let nextStopPoint = -1;
  for (let i = _stopPointLocations.length - 1; i >= 0; i -= 1) {
    const stopPointLocation = _stopPointLocations[i];
    if (stopPointLocation !== null) {
      const stopPointY = -screenHeight * stopPointLocation;
      if (translateY > stopPointY) {
        nextStopPoint = stopPointLocation;
      }
    }
  }
  if (nextStopPoint === -1) {
    const stopPointLocation =
      _stopPointLocations[_stopPointLocations.length - 1];
    if (stopPointLocation !== null) {
      nextStopPoint = stopPointLocation;
    }
  }
  return nextStopPoint;
};

const dragDownHelper = (
  _stopPointLocations: (number | null)[],
  screenHeight: number,
  translateY: number,
): number => {
  'worklet';

  let nextStopPoint = -1;
  for (let i = 0; i < _stopPointLocations.length; i += 1) {
    const stopPointLocation = _stopPointLocations[i];
    if (stopPointLocation !== null) {
      const stopPoint = -screenHeight * stopPointLocation;
      if (translateY < stopPoint) {
        nextStopPoint = stopPointLocation;
      }
    }
  }
  if (nextStopPoint === -1) {
    const [stopPointLocation] = _stopPointLocations;
    if (stopPointLocation !== null) {
      nextStopPoint = stopPointLocation;
    }
  }
  return nextStopPoint;
};

export { dragDownHelper, dragUpHelper };
