# Policy Management System

A backend application built with **Node.js, Express.js, and MongoDB** to manage policy data, import records from Excel/CSV files, schedule posts, and monitor application CPU usage.

## Features

- **Excel/CSV Import:** Import policy-related data into separate MongoDB collections.
- **Policy Management:** Store and manage policy records with references to related entities.
- **Scheduled Posts:** Schedule messages for a specified date and time and automatically publish them when due.
- **CPU Monitoring:** Monitor Node.js process CPU usage at regular intervals.
- **Automatic Restart:** Exit the application when CPU usage reaches 70%, allowing PM2 to restart the process.
- **Layered Architecture:** Organize code into routes, controllers, services, repositories, and models.
- **MongoDB Integration:** Persist application data using MongoDB and Mongoose.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript (ES Modules)
- PM2
- `pidusage`
- `node-cron`

## Project Structure

```text
policy_management/
├── src/
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── jobs/
│   │   └── post.scheduler.js
│   ├── middleware/
│   ├── models/
│   ├── monitor/
│   │   └── cpu.monitor.js
│   ├── repositories/
│   ├── routes/
│   └── services/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

Make sure you have installed:

- Node.js and npm
- MongoDB
- Git
- PM2 for process management

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/policy_management.git
```

Navigate to the project directory:

```bash
cd policy_management
```

Install dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/policy_management
```

Update `MONGODB_URI` to match your MongoDB configuration.

**Security:** Never commit `.env` files, database credentials, or API keys to GitHub.

## Run the Application

Start the application using your configured npm script, if available:

```bash
npm start
```

Alternatively, if your project does not define a start script:

```bash
node src/app.js
```

The server runs on:

```text
http://localhost:3000
```

## API Endpoints

### Schedule a Post

**Endpoint**

```http
POST /api/posts/schedule
```

**Request Body**

```json
{
  "message": "My scheduled announcement",
  "day": "YYYY-MM-DD",
  "time": "HH:mm"
}
```

Replace the date and time placeholders with a valid future date and time. The time is interpreted according to the server's local timezone.

**Expected Response**

```json
{
  "success": true,
  "message": "Post scheduled successfully",
  "data": {
    "message": "My scheduled announcement",
    "scheduledAt": "2026-12-25T09:00:00.000Z",
    "status": "pending"
  }
}
```

The returned date and other fields depend on the actual API response and scheduled time.

**Behavior**

1. Validate the message, date, and time.
2. Save the scheduled post with `pending` status.
3. Check for due posts periodically.
4. Publish due posts into the posts collection.
5. Update the scheduled post status to `completed`.

### Policy Import

Use the configured import endpoint:

```http
POST /api/import
```

The accepted upload format, field names, and multipart form-data key depend on the import route implementation.

### Policy APIs

Policy routes are mounted under:

```text
/api/policies
```

Refer to the route files for the available operations and required request parameters.

## CPU Monitoring

The application uses `pidusage` to monitor Node.js process CPU usage every five seconds.

When CPU usage reaches or exceeds **70%**, the monitor exits the process.

PM2 can restart the application automatically when it exits, provided the application is configured to run under PM2 with automatic restarts enabled.

Start the application with PM2:

```bash
npm install -g pm2
pm2 start src/app.js --name policy-management
```

Useful PM2 commands:

```bash
pm2 status
pm2 logs policy-management
pm2 restart policy-management
pm2 monit
```

**Note:** CPU measurements represent the monitored Node.js process, not necessarily total system CPU usage. Test the restart behavior in a development environment.

## Database Collections

The application uses MongoDB collections for policy data and related entities, such as:

- Agent
- User
- UserAccount
- LOB
- Carrier
- Policy
- ScheduledPost
- Post

The exact collection names are determined by the Mongoose model definitions.

## Error Handling and Validation

- Validate required request fields.
- Reject invalid date and time formats.
- Reject scheduling in the past.
- Use centralized error-handling middleware.
- Keep database configuration in environment variables.

## Development

After modifying the code, restart the application or use your configured development script.

```bash
pm2 restart policy-management
pm2 logs policy-management
```

## Future Improvements

- Add authentication and authorization.
- Add pagination and filtering for policy records.
- Add automated tests for API endpoints.
- Add structured logging and monitoring.
- Improve retry handling for failed scheduled posts.
- Add API documentation using Swagger/OpenAPI.

## License

This project is intended for learning, development, and assignment purposes. Add a license if you plan to distribute it publicly.
