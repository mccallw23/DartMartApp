module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs'], //add here
  },
   transformer: {
      assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    },
};