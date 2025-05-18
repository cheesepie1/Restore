
import { Box, Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import NavBar from "./NavBar";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useAppSelector } from "../store/store";


function App() {
  
  // get darkmode state from redux store
  const { darkMode } = useAppSelector(state => state.ui)

  // determine the palette mode based on darkMode
  const palleteType = darkMode ? 'dark' : 'light'

  // custom theme with different palette mode and background
  const theme = createTheme({
    palette: {
      mode: palleteType,
      background: {
        default: (palleteType === 'light') ? ' #eaeaea' : ' #121212'
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <ScrollRestoration />
      <CssBaseline />
      <NavBar />
      <Box
        sx={{
          minHeight: '100vh',
          background: darkMode
            ? 'radial-gradient(circle,rgb(4, 83, 112), #111B27)'
            : 'radial-gradient(circle,rgb(115, 161, 204),rgb(217, 228, 235))',
          py: 6
        }}
      >
        <Container maxWidth='xl' sx={{ mt: 8 }}>
          <Outlet />
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
