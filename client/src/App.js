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
  const isAuth = Boolean(useSelector((state) => state.access_token));
  console.log(isAuth);
  const user = useSelector((state) => state.user);
  const id = user ? user.id : ""
  console.log(id);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage userId={id}/> : <Navigate to="/" />}
            />
            <Route path="/taskManager/:userId" element={<TaskManager userId={id}/>} />
            <Route path="/schedule/:userId" element={<Schedule userId={id}/>} />
            <Route path="/note/:userId" element={<Note userId={id}/>} />
            {/* <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            /> */}
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App;