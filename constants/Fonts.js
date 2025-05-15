// Font configuration for the app
export default {
  // We'll use system fonts as fallbacks and load Crimson Pro via Google Fonts in the web version
  // For native, we would need to download and include the actual font files
  irish: {
    regular: 'CrimsonPro_400Regular',
    semiBold: 'CrimsonPro_600SemiBold',
  },
  system: {
    regular: 'System',
    medium: 'System-Medium',
    bold: 'System-Bold',
  }
};
