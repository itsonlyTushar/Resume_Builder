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
  Divider,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { notifications } from "../../constants/constant";
import { handleSignOut } from "../../auth/authOperations/logOut";
import { Circle } from "@mui/icons-material";
import { Dot } from "lucide-react";

function Navbar() {
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  const { reset } = useForm();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const isAccountMenuOpen = Boolean(accountMenuAnchor);
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);
  const isNotificationMenuOpen = Boolean(notificationMenuAnchor);

  const handleNotificationsOpen = (event) => {
    setNotificationMenuAnchor(event.currentTarget);
    if (isMobile) {
      setMobileMenuAnchor(null);
    }
  };

  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
    if (isMobile) {
      setMobileMenuAnchor(null);
    }
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAccountMenuAnchor(null);
    setNotificationMenuAnchor(null);
    setMobileMenuAnchor(null);
  };

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
          <i className="ri-user-line text-md mr-2"></i>
          My Account
        </Link>
      </MenuItem>

      <MenuItem onClick={handleMenuClose}>
        <Link to="/select_template" className="flex items-center">
          <i className="ri-file-add-line text-md mr-2"></i>
          Templates
        </Link>
      </MenuItem>

      <MenuItem onClick={handleMenuClose}>
        <Link to="/review" className="flex items-center">
          <i className="ri-bard-line text-md mr-2"></i>
          AI Resume Reviewer
        </Link>
        <span className="relative border text-xs font-medium rounded-lg bg-black text-white px-1 py-0.5 mx-2 ">
          New
          <Dot className="text-red-600 animate-pulse absolute bottom-2 left-5" />
          </span>
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
        <p className="ml-2">Account</p>
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
      sx={{ marginTop: isMobile ? "-60px" : "15px" }}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
          mt: 1.5,
          borderRadius: "12px",
          minWidth: "280px",
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
    >
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-base">Notifications</h3>
        <span className="text-blue-600 hover:text-blue-800 transition-colors font-medium cursor-pointer text-xs">
          Mark all as read
        </span>
      </div>
      <List sx={{ width: "100%", maxWidth: "320px", p: 0 }}>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem 
                sx={{ 
                  py: 1.5, 
                  px: 2, 
                  transition: "background-color 0.2s ease",
                  '&:hover': { backgroundColor: '#f9fafb' },
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5
                }}
              >
                <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${!notification.isRead ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <ListItemText
                  primary={notification.message}
                  primaryTypographyProps={{ 
                    variant: "body2",
                    color: "text.primary",
                    fontWeight: !notification.isRead ? 500 : 400,
                  }}
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))
        ) : (
          <ListItem sx={{ py: 3, justifyContent: "center" }}>
            <ListItemText
               primary="No new notifications"
               primaryTypographyProps={{ align: "center", color: "text.secondary" }}
             />
          </ListItem>
        )}
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
