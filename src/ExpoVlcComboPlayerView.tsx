import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoVlcComboPlayerViewProps } from './ExpoVlcComboPlayer.types';

const NativeView: React.ComponentType<ExpoVlcComboPlayerViewProps> =
  requireNativeView('ExpoVlcComboPlayer');

export default function ExpoVlcComboPlayerView(props: ExpoVlcComboPlayerViewProps) {
  return <NativeView {...props} />;
}
