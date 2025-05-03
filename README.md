# Shindow

## Previous requirements

Before attempt to run the project in any mode you will need to setup the environment variables and
have the following tools installed:

- Docker.
- docker-compose.
- Node.
- npm.

The project is divided in three folders:

- backend-shindow: This folder is for the API.
- frontend-shindow: This folder is for the frontend.
- server: This folder is the ubuntu server to which the API will connect.

### Creating environment files

To set up the environment files, follow these steps:

1. Navigate to the `backend-shindow` directory:

   - Locate the file `env_example.txt`.
   - Copy its content and paste it into a new file named `.env.production` for production mode or `.env.development` for development mode.
   - If unsure, default to `.env.production`.

2. Navigate to the `frontend-shindow` directory:

   - Locate the file `env_example.txt`.
   - Copy its content and paste it into a new file named `.env.production` for production mode or `.env.development` for development mode.
   - If unsure, default to `.env.production`.

3. There is only one thing you need to edit in the `.env` file in `backend-shindow`. And it is the variable _SERVER_IP_. Here you will need to replace with the IP if your server.
4. Ensure that the environment files are correctly configured in both directories before proceeding.

### Backend environment variables explanation

- `API_PORT`: Specifies the port on which the API server will run. This is the entry point for backend requests.
- `TZ`: Defines the timezone for the server. This ensures that all time-related operations are consistent with the specified timezone.
- `SERVER_IP`: The IP address of the server to which the API will connect via SSH. Replace this with the actual IP of your server.
- `SERVER_PORT`: The SSH port of the server. By default, this is usually `22`, but it may vary depending on your server configuration.
- `SECRET`: A secret key used to encrypt sensitive data. This must be the same in both the frontend and backend to ensure secure communication.
- `SESSION_MAX_AGE`: The maximum age of a session in milliseconds. This determines how long a user session remains valid before expiring.
- `CLIENT_DOMAIN`: The domain or URL where the frontend is running. This is used for cross-origin communication between the frontend and backend.
- `NODE_ENV`: Specifies the current environment in which the application is running. Common values are `production` for live environments and `development` for local testing.

### Frontend shindow variables explanation

### Frontend environment variables explanation

- `NEXT_PUBLIC_SECRET`: A secret key used to encrypt sensitive data. This must match the `SECRET` variable in the backend to ensure secure communication between the frontend and backend.
- `NEXT_PUBLIC_KEY_FILE_MAX_SIZE`: Specifies the maximum size (in bytes) allowed for the key file used during login. For example, a value of `1024` means the file size cannot exceed 1 KB.
- `NEXT_PUBLIC_TZ`: Defines the timezone for the frontend application. This ensures that all time-related operations are consistent with the specified timezone. Example: `"America/Argentina/Buenos_Aires"`.
- `NEXT_PUBLIC_BACK_BASE_URL`: The base URL where the backend is running. This is used for general communication between the frontend and backend. Example: `'http://localhost:5000'`.
- `NEXT_PUBLIC_API_BASE_URL`: The URL to the backend API. This is the specific endpoint where API requests are sent. Example: `'http://localhost:5000/api'`.
- `NEXT_PUBLIC_INITIAL_PATH`: The default path or route the user will be redirected to after logging in. Example: `'/'` for the home page.
- `NEXT_PUBLIC_CLIENT_BASE_URL`: The base URL where the frontend application is running. This is used for cross-origin communication and other client-specific configurations. Example: `'http://localhost:3000'`.

## Running the project

1. Go to the `backend-shindow` directory and run the following command:

```
npm i
```

2. Go to the `frontend-shindow` directory and run the following command:

```
npm i
```

3. Finally from the `shindow` directory you can run the following command to start the application in production mode:

```
npm run prod
```

4. Or if you want to run the application in development mode then use:

```
npm run dev
```

The application should be accesible now from the navigator in `localhost:3000` if you don't change it from the environment variables.
