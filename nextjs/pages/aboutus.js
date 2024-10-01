import { Box, Typography, Container } from '@mui/material';
import { Twitter, Facebook, YouTube, Instagram } from '@mui/icons-material'; // Social Icons

const leaders = [
  {
    name: "Wachirawut Suttitanon",
    imgSrc: "/harry.jpg", // Replace with actual image path
  },
  {
    name: "Chalisa Michaela Salazar",
    imgSrc: "/mk.jpg", // Replace with actual image path
  },
  {
    name: "Teeratorn Kanjanajit",
    imgSrc: "/Mark.jpg", // Replace with actual image path
  },
];

const goals = [
  {
    description: "Provide access to a wide range of  ",
    description2:" of stock data,financial ",
    description3 :"statements,and market trends.",
    imgSrc: "/click.png", // Replace with actual image path
  },
  {
    description: " Incorporate social features ",
    description2:"to facilitate discussions,  ",
    description3:" sharing of investment ideas",
    description4:",and community engagement.",
    imgSrc: "/social-media.png", // Replace with actual image path
  },
  {
    description: " Ensure that the website delivers  .",
    description2:" real-time data and updates to keep  ",
    description3:" users informed about market movements",
    imgSrc: "/setting-update.png", // Replace with actual image path
  },
];
const AboutUs = ({ isWelcome }) => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        position: "relative",
        backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url('/VIS_Background.png')`,
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'contain', // Cover the whole area
        textAlign: 'center',
        padding: '50px 0',
        color: '#ffffff', // Ensure text is white over dark background
        minHeight: '60 vh'
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'left', marginTop: '80px' }}>
        All investments carry 
      </Typography>
      <Typography variant="h1" sx={{ fontWeight: 'bold', marginBottom: '50px', textAlign: 'left' }}>
        some degree of risk
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '1.2rem', marginBottom: '100px', textAlign: 'left' }}>
        A platform to help investors analyze stock data and the stock market.
      </Typography>

      {/* Social Media Links */}
      <Box sx={{ marginBottom: '200px' }}>
        <Typography variant="h6">Follow us on</Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginTop: '10px',
          }}
        >
          <Twitter sx={{ color: '#ffffff' }} aria-label="Follow us on Twitter" />
          <Facebook sx={{ color: '#ffffff' }} aria-label="Follow us on Facebook" />
          <YouTube sx={{ color: '#ffffff' }} aria-label="Follow us on YouTube" />
          <Instagram sx={{ color: '#ffffff' }} aria-label="Follow us on Instagram" />
        </Box>
      </Box>

      {/* Our Story Section */}
      <Box sx={{ marginBottom: '80px', textAlign: 'left' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '40px' }}>
          Our Story
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', marginBottom: '10px' }}>
          There are many beginners in the stock market these days, or even investors who need help analyzing stock data.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', marginBottom: '10px' }}>
          We created this website to make it more convenient for investors and reduce manual data collection time.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', marginBottom: '10px' }}>
          By leveraging advanced analytics and user-friendly tools, we aim to empower users to make informed investment decisions.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', marginBottom: '150px' }}>
          Our platform provides real-time insights and data-driven recommendations tailored to individual investment goals.
        </Typography>
      </Box>

    
      <Box sx={{ marginBottom: '80px', textAlign: 'left' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '80px' }}>
          Our Members
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
          }}
        >
          {leaders.map((leader, index) => (
            <Box key={index} sx={{ textAlign: 'center', margin: '20px' }}>
              <Box
                component="img"
                src={leader.imgSrc}
                alt={leader.name}
                sx={{
                  width: '180px',
                  height: '200px',
                  borderRadius: '50%', // Make images circular
                  marginBottom: '10px',
                }}
              />
              <Typography variant="body1">{leader.name}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      
      {/* Our Goals Section */}
      <Box
  
      sx={{
        marginTop: "10%",
        width: "100vw", // Set to full viewport width
        maxWidth: "none", // Remove max-width restrictions
        backgroundColor: "#242323", // Set background color to dark gray
        color: "#fff", // Set text color to white for better contrast
        padding: "80px 0", // Add vertical padding
        textAlign: "center",
        position: "relative", // Ensure the positioning context
        left: "50%", // Move to the center of the viewport
        transform: "translateX(-50%)", // Center the box
      }}
    >
        <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '90px' }}>
          Our Goals
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-around',
          }}
        >
          {goals.map((goal, index) => (
            <Box key={index} sx={{ textAlign: 'center', margin: '40px' ,fontWeight: 'bold'}}>
              <Box
                component="img"
                src={goal.imgSrc}
                alt={`Goal ${index + 1}`}
                sx={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '0', // Keep images rectangular
                  marginBottom: '10px',
                }}
              />
              <Typography variant="body1">{goal.description}</Typography>
              <Typography variant="body1">{goal.description2}</Typography>
              <Typography variant="body1">{goal.description3}</Typography>
              <Typography variant="body1">{goal.description4}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default AboutUs;