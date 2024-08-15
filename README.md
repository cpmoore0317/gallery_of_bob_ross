<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=300&color=gradient&text=The%20Joy%20Of%20Coding&fontColor=FFFFFF" alt="WEB Development"/>
</div>

# Gallery of Bob Ross

## Overview

The "Gallery of Bob Ross" project is a web application designed to showcase and interact with episodes of "The Joy of Painting" by Bob Ross. It includes a MongoDB backend for storing episode data, colors used, and dates of airing. The backend is built with Express and Mongoose, and it offers a variety of endpoints for retrieving and filtering episode data.

## Features

- **Data Ingestion**: Import and merge data from CSV files into MongoDB.
- **Episode Endpoints**: Fetch episodes, filter by season, and search by title.
- **Chai Unittest**: Validate the responses and behavior of various routes.
- **Pagination**: Support for paginating results on search and episode listings.
- **CORS Support**: Enable cross-origin requests.
- **Error Logging**: Integrated logging for better debugging and monitoring.

## Getting Started

### Prerequisites

- **Node.js** (v14 or later)
- **MongoDB** (v4 or later)
- **npm** (v6 or later)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/cpmoore0317/gallery_of_bob_ross.git
cd gallery_of_bob_ross
```

2. **Clone the repository**

```bash
npm install
```

3. **Set Up MongoDB**

Ensure MongoDB is running locally on the default port (27017). Adjust the connection URI in the server.js and loadData.js files if needed.

4. **Run Data Loader**

Populate the MongoDB database with data from CSV files.
```bash
node src/loadData.js
```

5. **Start the Server**

```bash
npm start
```

The server will start on port 4000.

## API Endpoints

- **GET** `/episodes`  
  Fetch all episodes, colors, and dates.

- **GET** `/episodes/sorted-by-season`  
  Fetch episodes sorted by season in ascending order.

- **GET** `/episodes/:season/:episode`  
  Fetch episode details by season and episode number.

- **GET** `/episodes/season/:startSeason-:endSeason`  
  Fetch episodes for a range of seasons.

- **GET** `/episodes/search-by-title?title=TITLE`  
  Search episodes by title with pagination.

- **GET** `/episodes/season/:season`  
  Fetch episodes for a specific season.

- **GET** `/episodes/fields`  
  Fetch episodes with specific fields and pagination.

## Logging

The application uses a logging system integrated with the `logger` module. Logs are output to the console and can be customized as needed.

## Testing

Unit tests for routes are located in `src/routes.test.js`. To run the tests, use:

```bash
npm test
```

```plaintext
gallery_of_bob_ross/
│
├── data/
│   ├── colorsdatadump.csv
│   ├── datadump.csv
│   └── datesdatadump.csv
│
├── src/
│   ├── models/
│   │   ├── colors.js
│   │   ├── dates.js
│   │   └── episodes.js
│   ├── routes.js
│   ├── db.js
│   ├── loadData.js
│   └── server.js
│
├── js/
│   └── scripts.js
│
├── css/
│   └── styles.css
│
├── index.html
├── .gitignore
├── package.json
└── README.md
```

## Authors
Rachel Bradford
Parker Moore