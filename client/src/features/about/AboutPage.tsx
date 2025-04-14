import { Box, Container, Typography, Grid2 } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People"; 
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DownhillSkiingIcon from '@mui/icons-material/DownhillSkiing';

export default function AboutPage() {
  return (
    <Container maxWidth="lg" >
        <Box
        position="relative"
        sx={{
          width: "100%",
          height: "400px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src="/images/hero5.jpg"
          alt="office image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            padding: "16px",
            borderRadius: "8px",
            textAlign: "center",
            position:"absolute",
            top:"50%",
            left:"50%",
            transform:"translate(-50%, -50%)"
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#fff",
              whiteSpace: "pre-line",
              lineHeight: 1.5,
            }}
          >
            Restore, the trusted place where Australians start their shopping journey
          </Typography>
        </Box>
      </Box>

      <Box py={8} >
      <Grid2 container spacing={4} display='flex' justifyContent='space-between'>
        {/* New Customers */}
        <Grid2 sx={{xs: 12, sm: 6, md: 3}} textAlign="center">
          <PeopleIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h4" color="primary" fontWeight="bold">
            30k+
          </Typography>
          <Typography variant="body1" color="primary" fontWeight="bold">
            New customers every week
          </Typography>
        </Grid2>
        {/* Products */}
        <Grid2 sx={{xs: 12, sm: 6, md: 3}} textAlign="center">
          <DownhillSkiingIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h4" color="primary" fontWeight="bold">
            10k+
          </Typography>
          <Typography variant="body1" color="primary" fontWeight="bold">
            Products available
          </Typography>
        </Grid2>
        {/* Support */}
        <Grid2 sx={{xs: 12, sm: 6, md: 3}} textAlign="center">
          <SupportAgentIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h4" color="primary" fontWeight="bold">
            24/7
          </Typography>
          <Typography variant="body1" color="primary" fontWeight="bold">
            Customer support
          </Typography>
        </Grid2>
        {/* Brands */}
        <Grid2 sx={{xs: 12, sm: 6, md: 3}} textAlign="center">
          <LocalOfferIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="h4" color="primary" fontWeight="bold">
            100+
          </Typography>
          <Typography variant="body1" color="primary" fontWeight="bold">
            Partner brands
          </Typography>
        </Grid2>
      </Grid2>
    </Box>
    </Container>
  );
}