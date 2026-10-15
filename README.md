# Policy Management

## Description

This is a Node.js application developed using Express.js and MongoDB. It manages policy data, imports records from Excel/CSV files, schedules posts, and monitors CPU usage.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- PM2

## Features

- Import policy data from Excel/CSV files.
- Store policy details in MongoDB.
- Search and manage policy records.
- Schedule posts for a specific date and time.
- Monitor CPU usage and restart the application when CPU usage reaches 70%.

## Installation

Clone the repository:

bash
git clone https://github.com/YOUR_USERNAME/policy_management.git

Go to the project directory:

bash
cd policy_management

Install dependencies:

bash
npm install


## Configuration

Create a `.env` file in the project root and configure the following variables:

env
PORT=3000
MONGODB_URI=your_mongodb_connection_string


## Run the Application

bash
node src/app.js


The application runs on `http://localhost:3000`.

## Run with PM2

bash
pm2 start src/app.js --name policy-management


Check application status:

bash
pm2 status


View logs:

bash
pm2 logs policy-management


## API

Schedule a post:

POST /api/posts/schedule

Example request:

json
{
  "message": "Test post",
  "day": "YYYY-MM-DD",
  "time": "HH:mm"
}


The post is saved and published when the scheduled date and time are reached.

## Database

MongoDB is used to store policy information, related entities, and scheduled posts.

