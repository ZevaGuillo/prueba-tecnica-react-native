const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: [path.resolve(__dirname)],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json', '.tsx', '.ts'],
          alias: {
            '@/core': path.resolve(__dirname, 'src/core'),
            '@/data': path.resolve(__dirname, 'src/data'),
            '@/presentation': path.resolve(__dirname, 'src/presentation'),
            '@/shared': path.resolve(__dirname, 'src/shared'),
            '@': path.resolve(__dirname),
          },
        },
      ],
    ],
  };
};
