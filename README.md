# Shindow

## Previous configurations

Before attempt to run the project in any mode you will need to setup the environment variables.
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
