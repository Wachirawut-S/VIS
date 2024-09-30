// pages/index.js
import Head from "next/head";
import { Box, Typography, Button, Grid, Container } from "@mui/material";
import { useInView } from "react-intersection-observer";
import { CSSTransition } from "react-transition-group";
import { useEffect, useState } from "react";
import useBearStore from "@/store/useBearStore";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import CalculateIcon from '@mui/icons-material/Calculate';
import ViewListIcon from '@mui/icons-material/ViewList';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import styles from "@/styles/Index.module.css";
import Link from "next/link"; // Importing Link from Next.js

function Home() {
  const { appName } = useBearStore((state) => ({
    appName: state.appName,
  }));

  return (
    <>
      <Head>
        <title>{`${appName} - Home`}</title>
      </Head>

      <main style={{ color: '#fff', paddingTop: "16%" }}>
        <Section 
          title={`${appName}`} 
          icon={<StarIcon />} 
          isWelcome 
          color="#FFEB3B" 
          description="Welcome to our Value Investing Screener, where you can make informed investment decisions." 
        />
        <Section 
          title="Getting Started" 
          icon={<AccessAlarmIcon />} 
          color="#FF4081" 
          description="Learn the basics of how to use our application to maximize your investment potential." 
          link="/register" // Adding a link for Getting Started
        />
        <Section 
          title="Display Feature" 
          icon={<ViewListIcon />} 
          color="#4CAF50" 
          description="Easily view and analyze the financial scores of various stocks." 
          link="/display" // Adding a link for Display Feature
        />
        <Section 
          title="Calculator Feature" 
          icon={<CalculateIcon />} 
          color="#3F51B5" 
          description="Use our calculator to evaluate potential investment opportunities." 
          link="/calculator" // Adding a link for Calculator Feature
        />
        <Section 
          title="Community" 
          icon={<PeopleIcon />} 
          color="#FFC107" 
          description="Join our community to discuss and share insights with fellow investors." 
          link="/community" // Adding a link for Community
        />

        <TeamSection />
      </main>
    </>
  );
}

const Section = ({ title, icon, isWelcome = false, color, description, link }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (inView) {
      setAnimate(true);
    }
  }, [inView]);

  return (
    <Container
      ref={ref}
      maxWidth="lg"
      sx={{
        minHeight: isWelcome ? "75vh" : "60vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "50px 0",
        position: "relative",
        marginTop: isWelcome ? "-180px" : "10%",
        backgroundImage: isWelcome ? `url('/VIS_Background.png')` : 'none', // Background image for the welcome section
        backgroundSize: 'cover', // Cover the whole area
        backgroundPosition: 'center', // Position the image on the right
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))', // Adjust gradient opacity
          zIndex: 1, // Ensure the gradient is above the background image
        },
      }}
      className={styles.section}
    >
      {/* Text Content with higher zIndex */}
      <Box sx={{ position: 'relative', zIndex: 2, color: '#fff' }}> {/* Ensure text is white */}
        {/* Vertical Line */}
        <Box
          sx={{
            position: "absolute",
            left: "20px",
            top: isWelcome ? "17%%" : "12%",
            bottom: "0",
            width: "5px",
            "--line-color": color,
          }}
          className={`${styles.verticalLine} ${animate ? styles.animateLine : ""}`}
        />

        {/* Icon */}
        <Box
          sx={{
            position: "absolute",
            left: "0px",
            top: "10.2%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
          className={`${styles.iconContainer} ${animate ? styles.animateIcon : ""}`}
        >
          {icon && (
            <Box
              sx={{
                backgroundColor: color,
                borderRadius: "50%",
                padding: "10px",
                boxShadow: `0 0 20px ${color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className={styles.iconBox}
            >
              {icon}
            </Box>
          )}
        </Box>

        {/* Text Content */}
        <CSSTransition
          in={animate}
          timeout={1000}
          classNames={{
            enter: styles.fadeEnter,
            enterActive: styles.fadeEnterActive,
            exit: styles.fadeExit,
            exitActive: styles.fadeExitActive,
          }}
          unmountOnExit
        >
          <Grid container spacing={4} alignItems="flex-start" direction="column" paddingLeft="15%">
            <Grid item>
              <Typography variant="h1" gutterBottom sx={{ fontSize: '2.6rem', marginTop: '20px' }}>
                {title}
              </Typography>
              {/* Description Text */}
              {description && (
                <Typography variant="body1" paragraph sx={{ marginBottom: '20px' }}>
                  {description}
                </Typography>
              )}
              {!isWelcome && (
                <Typography variant="body1" paragraph>
                  This section introduces the {title.toLowerCase()} feature.
                </Typography>
              )}
              {/* Add the button and link only if it's not the welcome section */}
              {!isWelcome && (
                <Link href={link} passHref>
                  <Button variant="contained" color="primary">
                    {title}
                  </Button>
                </Link>
              )}
            </Grid>
          </Grid>
        </CSSTransition>
      </Box>
    </Container>
  );
};

const TeamSection = () => {
  return (
    <Box
      sx={{
        marginTop: "20%",
        width: "100%", // Set to full width
        backgroundColor: "#242323", // Set background color to black
        color: "#fff", // Set text color to white for better contrast
        padding: "50px 0", // Add vertical padding
        textAlign: "center",
      }}
    >
      {/* React Logo Animation */}
      <Box sx={{ marginBottom: "20px" }}>
        <img
          src="/images/react-logo.svg" // Update this path as needed
          alt="React Logo"
          className={styles.reactLogo}
        />
      </Box>
      <Typography variant="h5" gutterBottom>
        Development Team
      </Typography>
      <Typography variant="body1">
        Wachirawut Suttitanon
        <br />
        Teeratorn Kanjanajit
        <br />
        Chalisa michaela Salazar
        <br />
        We are a passionate team dedicated to providing the best experience.
      </Typography>
    </Box>
  );
};

export default Home;
