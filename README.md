# Shindow

## Development mode

### Previous configurations

Before attempt to run the project you must configure some environment variables. <br>
The project is divided in three folders:

- backend-shindow: This folder is for the API.
- frontend-shindow: This folder is for the frontend.
- server: This folder is the ubuntu server to which the API will connect.

In the `backend-shindow` there is a file `env_example.txt`. Copy the content of the file and paste it in a new file in the same directory and name it `.env.development`.
You will need to change the variable `SERVER_IP` with your own local ip.

In the `frontend-shindow` there is also a file `env_example.txt`. Copy the content of the file and paste it in a new file in the same directory and name it `.env.local`.

### Running the project

In order to run the project just execute the following command in the root directory of the project.

```
npm run dev
```

If you did not modify it in the environment file the client should be running now in `http://localhost:3000`.

You can attempt to login from `http://localhost:3000/login`. The default credentials are:

- user: root
- password: root

You can modify this by changing the Dockerfile in the `server` folder.
