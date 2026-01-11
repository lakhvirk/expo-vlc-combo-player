import * as React from 'react';

import { ExpoVlcComboPlayerViewProps } from './ExpoVlcComboPlayer.types';

export default function ExpoVlcComboPlayerView(props: ExpoVlcComboPlayerViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
