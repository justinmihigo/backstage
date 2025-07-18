import {
  createBaseThemeOptions,
  createUnifiedTheme,
  defaultTypography,
  palettes,
} from '@backstage/theme';
import poppins from '../assets/fonts/Poppins-Regular.ttf';

const myCustomFont = {
  fontFamily: 'poppins',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 300,
  src: `
    local('poppins'),
    url(${poppins}) format('ttf'),
  `,
};
export const myTheme = createUnifiedTheme({
  ...createBaseThemeOptions({
    palette: palettes.light,
    typography:{
      ...defaultTypography,
      htmlFontSize: 16,
      fontFamily: poppins
    },
    defaultPageTheme: 'home',
  }),
  fontFamily: 'poppins',
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': [myCustomFont],
      },
    },
  },
});