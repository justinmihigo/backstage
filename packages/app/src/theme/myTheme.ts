import {
    createBaseThemeOptions,
    createUnifiedTheme,
    defaultTypography,
    palettes,
  } from '@backstage/theme';
  
  export const myTheme = createUnifiedTheme({
    ...createBaseThemeOptions({
      palette: palettes.light,
      typography: {
        ...defaultTypography,
        htmlFontSize: 16,
        fontFamily: 'Roboto, sans-serif',
        h1: {
          fontSize: 72,
          fontWeight: 700,
          marginBottom: 10,
        },
      },
      defaultPageTheme: 'home',
    }),
  });