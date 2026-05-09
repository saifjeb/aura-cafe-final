import { Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Container sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        404
      </Typography>

      <Typography variant="h6" gutterBottom>
        Page not found
      </Typography>

      <Button component={Link} to="/" variant="contained">
        Back Home
      </Button>
    </Container>
  );
}

export default NotFound;