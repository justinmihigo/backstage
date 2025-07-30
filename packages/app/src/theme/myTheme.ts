import {
  createBaseThemeOptions,
  createUnifiedTheme,
  defaultTypography,
  genPageTheme,
  palettes,
  shapes,
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
    palette: {
      ...palettes.light,
      primary: {
        main: '#0163CE', // Change this to your desired color
        contrastText: '#fff',
      },
      secondary: {
        main: '#ff4081',
      },
      background: {
        default: '#f5f5f5',

      },
      navigation: {
        background: '#022c5aff',
        indicator: '#0163CE',
        color: '#d5d6db',
        selectedColor: '#ffffff',
      },

    },
    typography: {
      ...defaultTypography,
      htmlFontSize: 15,
      fontFamily: poppins
    },
    defaultPageTheme: 'home',
  },

  ),
  fontFamily: 'poppins',
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': [myCustomFont],
      },
    },
  },
  pageTheme: {
      home: genPageTheme({ colors: ['#0163CE'], shape: shapes.wave}),
      other: genPageTheme({ colors: ['#0163CE'], shape: shapes.wave}),
    },
});