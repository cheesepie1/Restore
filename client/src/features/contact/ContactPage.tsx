import { Box, Typography, TextField, Button, Grid2 } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';



export default function ContactPage() {
 const customInputProps = {
        InputProps: {
          sx: {
            color: '#fff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ccc',
            }
          }
        },
        InputLabelProps: {
          sx: {
            color: '#fff',
          }
        }
      };
    return (
        <Box
            sx={{
                width: "90vw",
                height: "90vh",
                mx: "auto",  
                my: "auto", 
                backgroundImage: 'url(/images/hero6.jpg)',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                alignItems: "center",
                flexDirection: "column", // 垂直排列子元素
                justifyContent: "flex-start",
                px: 2,
            }}
        >
            <Box sx={{ backgroundColor: "rgba(30, 30, 30, 0.7)",  width: "70vw", height: "90vh"}}>

                <Box textAlign="center" mb={4} sx={{ py: 2, borderRadius: 2 }}>
                    <Typography variant="h4" sx={{color: "#fff"}} gutterBottom>Contact Us</Typography>
                    <Typography sx={{ color: "#fff" }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    </Typography>
                    <Typography sx={{ color: "#fff" }}>
                        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Typography>
                </Box>


                <Grid2 container spacing={4} sx={{ px: 2, py: 2, borderRadius: 2,
                    color: "#fff", 
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>

                    <Grid2 sx={{ xs: 8, md: 4 }}>
                        <Box mb={6} display="flex" alignItems="center">
                            <LocationOnIcon color="primary" sx={{ mr: 2 }} />
                            <Box>
                                <Typography variant="h5" sx={{color: '#0796BD'}}>Address</Typography>
                                <Typography>4671 Sugar Camp Road, Owatonna, Minnesota, 55060</Typography>
                            </Box>
                        </Box>
                        <Box mb={6} display="flex" alignItems="center">
                            <PhoneIcon color="primary" sx={{ mr: 2 }} />
                            <Box>
                                <Typography variant="h5" sx={{color: '#0796BD'}}>Phone</Typography>
                                <Typography>507-475-60945-6094</Typography>
                            </Box>
                        </Box>
                        <Box mb={6} display="flex" alignItems="center">
                            <EmailIcon color="primary" sx={{ mr: 2 }} />
                            <Box>
                                <Typography variant="h5" sx={{color: '#0796BD'}}>Email</Typography>
                                <Typography>wrub7d7810e@temporary-mail.net</Typography>
                            </Box>
                        </Box>
                    </Grid2>


                    <Grid2 sx={{ xs: 8, md: 4, maxWidth: 400, width: '100%'}} >
                        <Typography variant="h5" gutterBottom {...customInputProps}>Send Message</Typography>
                        <TextField fullWidth label="Full Name" variant="outlined" margin="normal" {...customInputProps}/>
                        <TextField fullWidth label="Email" variant="outlined" margin="normal" {...customInputProps}/>
                        <TextField
                            fullWidth
                            label="Type your Message..."
                            variant="outlined"
                            multiline
                            rows={4}
                            margin="normal"
                            {...customInputProps}
                        />
                        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                            Send
                        </Button>
                    </Grid2>
                </Grid2>
            </Box>





        </Box>
    );
}
