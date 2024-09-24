# VIS
 Value Investing Screener

This project is a **Value Investing Screener**. It is a web application that allows users to search for stocks based on their financial metrics and investment strategies. This web application project consists of seven key pages: Login, Dashboard, View, Searching, Performance Screener, Financial Calculator, and Community Forums. It offers various tools and key performance indicators (KPIs) to assist users in financial analysis, including Gross Profit Margin, Return on Equity, Return on Invested Capital, Selling, General and Administrative Expenses to Revenue, Net Earning Consistency, Annual Growth Rate, Compound Annual Growth Rate, Debt Level Indicator, Cash Balance Indicator, Property, Plant, & Equipment (PPE) Turnover, Return on Assets, Debt to Equity Ratio, Current Ratio, Quick Ratio, Intrinsic Value, and Margin of Safety. Additionally, the project excludes all trading indicators, focusing on long-term investing principles rather than speculation, to help users avoid the pitfalls of emotional trading and prioritize sustained growth and value.


# Deloper Team

   **Wachirawut Suttitanon** - [@Wachirawut-S](https://github.com/Wachirawut-S)

# Project Descriptions

This project is a Next.js application containerized with Docker. It uses Docker Compose to simplify development and dependency management, including building and running the application. The project also integrates **Material UI** for creating a responsive and sleek user interface.

This project is developed for GUI chapter of the Advance Computer Programming class under the Department of Robotics and AI Engineering, School of Engineering, KMITL.

## Project Structure
s
```plaintext
.
├── docker-compose.yaml    # Docker Compose configuration
├── nextjs/
│   ├── components/        # React components for the project
│   ├── pages/             # Next.js pages
│   ├── public/            # Static assets
│   ├── Dockerfile         # Dockerfile for building the Next.js app
│   ├── jsconfig.json      # JS configuration for path aliases
│   ├── next.config.mjs    # Next.js configuration file
│   ├── package.json       # Project dependencies and scripts
│   └── .gitignore         # Ignored files for Git
└── fastapi/
    ├── app.py             # FastAPI app entry point
    ├── Dockerfile         # Dockerfile for FastAPI backend
    ├── requirements.txt   # Python dependencies for FastAPI
    ├── database.py        # Database connection and queries
    ├── routes/            # FastAPI routes
    └── .gitignore         # Ignored files for FastAPI
```

### The `pages` Folder (**Main folder to implement)

In a Next.js project, the `pages` folder is central to defining the routes for your application. Each file inside the `pages` directory corresponds to a route based on its file name:

- **`index.js`**: The main landing page of your application, accessible at the root URL (`/`). This is where you'll typically start developing the homepage or entry point of your application.
  
- **Dynamic Routing**: You can also create dynamic routes using square brackets. For example, `pages/[id].js` would map to routes like `/123`, `/about`, etc., allowing you to fetch dynamic content based on the route parameter.

Example structure:
```plaintext
pages/
├── index.js           # Home page
├── login.js           # Log-in page
├── register.js        # register page
├── view.js            # inspect company stock details
├── history.js         # view and compare scores of each company
├── register.js        # register page
```

## FastAPI and PostgreSQL

The FastAPI backend is connected to a PostgreSQL database. The `database.py` file contains the database connection logic and functions to interact with the database asynchronously using `databases` and `asyncpg`.

### Pydantic Models:

UserCreate, UserUpdate, and User: These models define the schema for the user data, used for input validation and serialization of request and response data.

### API Endpoints:
The routes folder in the FastAPI backend contains the API route definitions, which are essentially the endpoints that clients (such as the frontend or external systems) can use to interact with the backend. You can create your new endpoint but don't forget to mention in [app.py](/fastapi/app.py)

Example FastAPI route to interact with the PostgreSQL database can be found in [users.py](/fastapi/routes/users.py)

### Database Interaction Function:
The database interaction function e.g. the query string can be found in [database.py](/fastapi/database.py)

## Key Technology

- **Next.js Frontend**: Utilizes Next.js for server-side rendering and static generation.
- **FastAPI Backend**: Provides a fast and easy-to-use API layer with support for asynchronous operations.
- **PostgreSQL Database**: Fully integrated with PostgreSQL for persistent data storage.
- **Dockerized**: Easy to build and deploy using Docker, ensuring consistency across environments.
- **MUI (Material UI)**: For building a responsive and elegant UI.
- **State Management**: Uses `zustand` for state management in the frontend.
- **API Proxy**: Configured with `rewrites` to route API calls to the backend.

## Implementing with Material UI

This project uses [Material UI (MUI)](https://mui.com/material-ui/getting-started/overview/) to enhance the user interface design and development. MUI is a popular React component library that provides pre-built, customizable UI components based on Google's Material Design guidelines.

