import { useState } from "react";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Logo from "../../pages/Logo";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { handleSignOut } from "../UserPage/User";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Navbar() {
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  const { reset } = useForm();
  const navigate = useNavigate();

  const notifications = [
    { id: 1, message: "Check new features", isRead: false },
    {
      id: 2,
      message: "Please remember you can download only 2 resumes",
      isRead: false,
    },
    { id: 3, message: "Keep resume short and simple", isRead: false },
  ];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Menu open states
  const isAccountMenuOpen = Boolean(accountMenuAnchor);
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);
  const isNotificationMenuOpen = Boolean(notificationMenuAnchor);

  // Handle menu openings
  const handleNotificationsOpen = (event) => {
    setNotificationMenuAnchor(event.currentTarget);
    if (isMobile) {
      setMobileMenuAnchor(null); 
    }
  };

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
    if (isMobile) {
      setMobileMenuAnchor(null); // Close mobile menu when opening account menu
    }
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  // Handle menu closings
  const handleMenuClose = () => {
    setAccountMenuAnchor(null);
    setNotificationMenuAnchor(null);
    setMobileMenuAnchor(null);
  };

  // Account menu component
  const accountMenu = (
    <Menu
      anchorEl={accountMenuAnchor}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isAccountMenuOpen}
      onClose={handleMenuClose}
      sx={{ marginTop: isMobile ? "-60px" : "-5px" }}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link to="/user" className="flex items-center">
          <i className="fa-solid fa-user text-md mr-2"></i>
          My Account
        </Link>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleSignOut(dispatch, navigate, reset);
          handleMenuClose();
        }}
      >
        <i className="fa-solid fa-arrow-right-from-bracket text-md mr-2"></i>
        Sign Out
      </MenuItem>
    </Menu>
  );

  // Mobile menu component
  const mobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleNotificationsOpen}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p className="ml-2">Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleAccountMenuOpen}>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        <p className="ml-2">My Account</p>
      </MenuItem>
    </Menu>
  );

  // Notifications menu component
  const notificationsMenu = (
    <Menu
      anchorEl={notificationMenuAnchor}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isNotificationMenuOpen}
      onClose={handleMenuClose}
      sx={{ marginTop: isMobile ? "-60px" : "-5px" }}
    >
      <List sx={{ width: "250px", maxWidth: "100vw" }}>
        {notifications.map((notification) => (
          <ListItem key={notification.id} sx={{ py: 1 }}>
            <ListItemText>
              <i className="ri-arrow-drop-right-fill"></i>
              {notification.message}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#1D1F24",
          border: "none",
          borderRadius: "14px",
          marginTop: "0.5rem",
          width: "90vw",
          marginLeft: "5vw",
        }}
      >
        <Toolbar>
          <Logo />
          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleNotificationsOpen}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleAccountMenuOpen}
              >
                <AccountCircle />
              </IconButton>
            </Box>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <IconButton
              size="large"
              color="inherit"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Toaster />
      {notificationsMenu}
      {mobileMenu}
      {accountMenu}
    </Box>
  );
}

export default Navbar;
