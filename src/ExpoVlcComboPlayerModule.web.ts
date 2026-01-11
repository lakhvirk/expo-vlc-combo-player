import { registerWebModule, NativeModule } from 'expo';

import { ExpoVlcComboPlayerModuleEvents } from './ExpoVlcComboPlayer.types';

class ExpoVlcComboPlayerModule extends NativeModule<ExpoVlcComboPlayerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoVlcComboPlayerModule, 'ExpoVlcComboPlayerModule');
