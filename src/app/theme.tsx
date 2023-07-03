import { createTheme } from "@mui/material";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin-ext"],
});

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }

  interface PaletteColor {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(49, 133, 127)",
    },
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
    h3: {
      fontSize: 40,
    },
  },
});

export default theme;
