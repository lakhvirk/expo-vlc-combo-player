// Reexport the native module. On web, it will be resolved to ExpoVlcComboPlayerModule.web.ts
// and on native platforms to ExpoVlcComboPlayerModule.ts
export { default } from './ExpoVlcComboPlayerModule';
export { default as ExpoVlcComboPlayerView } from './ExpoVlcComboPlayerView';
export * from  './ExpoVlcComboPlayer.types';
