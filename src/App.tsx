import "./index.scss"
import { MantineProvider, createTheme, rem } from '@mantine/core';
import Home from "./pages/home/Home";
import { useAuth } from "./services/AuthContext";
import { Notifications } from "@mantine/notifications";
import Dashboard from "./pages/dashboard/Dashboard";

const theme = createTheme({
  primaryColor: 'green',
  fontFamily: 'Verdana, sans-serif',
  fontSizes: {
    xs: rem(10),
    sm: rem(11),
    md: rem(14),
    lg: rem(16),
    xl: rem(20),
  },
  colors: {
    green: [
      "#e4fff0",
      "#d0fce6",
      "#a3f6cb",
      "#73f0af",
      "#4cec98",
      "#32e989",
      "#20e880",
      "#0cce6d",
      "#00b760",
      "#009e4f"
    ]
  }
  // components: {}
});

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <Notifications />
        <div className="body">
        {isAuthenticated ? <Dashboard /> : <Home />}
        </div>
      </MantineProvider>
    </>
  )
}