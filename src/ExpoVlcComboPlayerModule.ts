import { NativeModule, requireNativeModule } from 'expo';

import { ExpoVlcComboPlayerModuleEvents } from './ExpoVlcComboPlayer.types';

declare class ExpoVlcComboPlayerModule extends NativeModule<ExpoVlcComboPlayerModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoVlcComboPlayerModule>('ExpoVlcComboPlayer');
