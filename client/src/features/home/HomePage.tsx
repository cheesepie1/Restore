import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <Box maxWidth='xl' mx='auto' px={4} position='relative' >
      <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' position='relative' zIndex={1} minHeight={{ xs: '100vh', md: '80vh' }}>
        <img src="/images/hero1.jpg" alt="ski resort image"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '16px',
            zIndex: -1
          }}
        />
        <Box
          display='flex'
          flexDirection='column'
          p={8}
          alignItems='center'
          borderRadius={4}
        >
          <Typography
            variant="h1"
            color="white"
            fontWeight='bold'
            textAlign='center'
            sx={{     
              my: 3,
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' } }}
            zIndex={0}

          >
            Welcome to Restore!

          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to='/catalog'
            sx={{
              mt: 8,
              backgroundImage: 'linear-gradient(to right, #2563eb, #06b6d4)',
              fontWeight: 'bold',
              color: 'white',
              borderRadius: '16px',
              px: { xs: 4, sm: 6, md: 8 },
              py: { xs: 1, sm: 1.5, md: 2 },
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              border: '2px solid transparent'

            }}
          >
            Go to shop

          </Button>

        </Box>


      </Box>

    </Box>
  )
}