module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/Component',
          '@navigation': './src/navigation',
          '@assets': './src/assets',
          '@store': './src/store',
          '@utils': './src/utils',
          '@screens': './src/screens',
          '@resources': './src/resources',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
