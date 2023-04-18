import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import Login from "scenes/login"
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import TaskManager from "scenes/taskManager";
import Schedule from "scenes/schedule";
import Note from "scenes/note";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  const { id } = useSelector((state) => state.user);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/taskManager" element={<TaskManager userId={id}/>} />
            <Route path="/schedule" element={<Schedule userId={id}/>} />
            <Route path="/note" element={<Note userId={id}/>} />
            {/* <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            /> */}
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;