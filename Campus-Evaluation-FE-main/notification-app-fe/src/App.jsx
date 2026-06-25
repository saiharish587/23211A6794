import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import { NotificationsPage } from "./pages/NotificationsPage";
import { PriorityPage } from "./pages/PriorityPage";

function Navigation() {
  const location = useLocation();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Campus Notifications
        </Typography>
        <Button 
          component={Link} 
          to="/" 
          color={location.pathname === "/" ? "primary" : "inherit"}
        >
          All
        </Button>
        <Button 
          component={Link} 
          to="/priority" 
          color={location.pathname === "/priority" ? "primary" : "inherit"}
        >
          Priority Inbox
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navigation />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<NotificationsPage />} />
            <Route path="/priority" element={<PriorityPage />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  );
}