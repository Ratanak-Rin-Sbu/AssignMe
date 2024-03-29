import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  DarkMode,
  LightMode,
  Menu,
  Close,
  AssignmentTurnedIn,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const NavBar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const logout = async () => {
    dispatch(setLogout());
    navigate("/home");
  }

  // const fullName = `${user.firstName} ${user.lastName}`;

  return <FlexBetween padding="1rem 6%" backgroundColor={alt}>
    <FlexBetween gap="1rem" alignItems="center">
      <Typography
        fontWeight="bold"
        fontSize="clamp(1rem, 2rem, 2.25rem)"
        // style={{color: "#FF74B1"}}
        sx={{
          "&:hover": {
            cursor: "pointer",
            },
        }}
        onClick={() => navigate('/home')}
      >
          AssignME
      </Typography>
      <AssignmentTurnedIn fontSize="large"/>
    </FlexBetween>
    {/* DESKTOP NAV */}
    {isNonMobileScreens ? (
      <FlexBetween gap="2rem" alignItems="center">
        <IconButton onClick={() => dispatch(setMode())}>
          {theme.palette.mode == "dark" ? (
            <DarkMode sx={{ fontSize: "25px" }}/>
          ) : <LightMode sx={{ color: dark, fontSize: "25px" }}/>}
        </IconButton>
        <FormControl variant="standard">
          <Select
            // value= {fullName}
            sx = {{
              backgroundColor: neutralLight,
              width: "150px",
              borderRadius: "0.25rem",
              p: "0.25rem 1rem",
              "& .MuiSvgIcon-root": {
                pr: "0.25rem",
                width: "3rem"
              },
              "& .MuiSelect-select:focus": {
                backgroundColor: neutralLight
              }
            }}
            input={<InputBase />}
          >
            {/* <MenuItem value={fullName}> */}
            <MenuItem>
              {/* <Typography>{fullName}</Typography> */}
              <Typography></Typography>
            </MenuItem>
            <MenuItem onClick={logout}>Log Out</MenuItem>
          </Select>
        </FormControl>
      </FlexBetween>
    ) : (
      <IconButton
        onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
      >
        <Menu />
      </IconButton>
    )}

    {/* MOBILE NAV */}
    {!isNonMobileScreens && isMobileMenuToggled && (
      <Box
      position="fixed"
      right = "0"
      bottom = "0"
      height = "100%"
      zIndex = "10"
      maxWidth = "500px"
      minWidth = "300px"
      backgroundColor = { background }
      >
        {/* CLOSE ICON */}
        <Box display="flex" justifyContent="flex-end" p="1rem">
          <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
            <Close />
          </IconButton>
        </Box>

      {/* MENU ITEMS */}
      <FlexBetween display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="3rem">
        <IconButton onClick={() => dispatch(setMode())} sx={{ fontSize: "25px" }}>
          {theme.palette.mode == "dark" ? (
            <DarkMode sx={{ fontSize: "25px" }}/>
          ) : <LightMode sx={{ color: dark, fontSize: "25px" }}/>}
        </IconButton>
        <FormControl variant="standard">
          <Select
            // value= {fullName}
            sx = {{
              backgroundColor: neutralLight,
              width: "150px",
              borderRadius: "0.25rem",
              p: "0.25rem 1rem",
              "& .MuiSvgIcon-root": {
                pr: "0.25rem",
                width: "3rem"
              },
              "& .MuiSelect-select:focus": {
                backgroundColor: neutralLight
              }
            }}
            input={<InputBase />}
          >
            {/* <MenuItem value={fullName}> */}
            {/* <MenuItem> */}
              {/* <Typography>{fullName}</Typography> */}
              {/* <Typography></Typography> */}
            {/* </MenuItem> */}
            <MenuItem onClick={logout}>Log Out</MenuItem>
          </Select>
        </FormControl>
      </FlexBetween>
     </Box>
    )}
  </FlexBetween>;
};

export default NavBar;