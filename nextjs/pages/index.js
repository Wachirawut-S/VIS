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
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
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
          icon={<AttachMoneyIcon />} 
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
          title="INDEX FUNDS" 
          icon={<TrendingUpIcon />} 
          color="#0095ff" 
          description="Learn about popular index funds like S&P 500 and Nasdaq 100." 
        >
          {/* Only the two buttons for INDEX FUNDS */}
          <Link href="/S&P500" passHref>
            <Button variant="contained" color="primary" sx={{ marginRight: '10px' }}>
              S&P 500
            </Button>
          </Link>
          <Link href="/Nasdaq100" passHref>
            <Button variant="contained" color="primary">
              Nasdaq 100
            </Button>
          </Link>
        </Section>
        <Section 
          title="Display" 
          icon={<ViewListIcon />} 
          color="#4CAF50" 
          description="Easily view and analyze the financial scores of various stocks." 
          link="/display" // Adding a link for Display Feature
        />
        <Section 
          title="Calculator" 
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

const Section = ({ title, icon, isWelcome = false, color, description, link, children }) => {
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
        backgroundImage: isWelcome ? `url('/VIS_Background.png')` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))',
          zIndex: 1,
        },
      }}
      className={styles.section}
    >
      <Box sx={{ position: 'relative', zIndex: 2, color: '#fff' }}>
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
              {/* Render link button if provided */}
              {!isWelcome && link && (
                <Link href={link} passHref>
                  <Button variant="contained" color="primary">
                    {title}
                  </Button>
                </Link>
              )}
              {/* Render additional buttons if provided */}
              {children}
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
        width: "100%",
        backgroundColor: "#242323",
        color: "#fff",
        padding: "50px 0",
        textAlign: "center",
      }}
    >
      <Box sx={{ marginBottom: "20px" }}>
        <img
          src="/images/react-logo.svg"
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
        Chalisa Michaela Salazar
        <br />
        We are a passionate team dedicated to providing the best experience.
      </Typography>
    </Box>
  );
};

export default Home;
