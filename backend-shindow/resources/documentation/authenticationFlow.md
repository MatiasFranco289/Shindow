# Authentication flow

## Login

When the client reach the auth endpoint for the very first time he should be not sending any cookie or aditional information. Using the `express-session` library a unique session id is created then, through the `SshConnectionManager` class which uses the `ssh2` library, if the credentials provided by the client are correct, a new connection to the server is created. This new connection is stored is a private _Map_ inside this class using as key to identify the connection the previously generated unique session id. From now on, this connection can be obtained using the `SshConnectionManager` because this class is a _Singleton_ class. Finally a successful response is sended to the user. The session id information will be stored in a cookie in the client side.

# Logout

There are two ways the connection can be finished. The first one is if the user itself reach's the logout endpoint. If the provided session id stored in the cookie of the client has a corresponding active connection in the _Map_ of `SshConnectionManager` class the connection will be ended and a successful response will be sended to the client. Whether or not the provided session id has an active connection the cookie will be deleted from the client when the response is sended.

The second way to finish a connection happens if the max lifetime of the session is reached. When the user hit's the login endpoint and the cookie is created it has a maximum lifetime. Also, when the connection is stored in the _Map_ inside the `SshConnectionManager` a timer starts, when the timer reach's zero the connection will be automatically closed and deleted from memory. If the user cookie expires or if the connection is deleted in the server (Events who should happen at same time), the user will be no longer authenticated. The maximum lifetime of the session can be modified from the environment file.

# Validation

Every time a request is received it is first intercepted by a middleware function. This function will try to get the Cookie with the session id and checks if there are a open connection having that session id as identifier. If everything is okay the request it's allowed to reach the endpoint. If the Cookie is not present or if it not have a session id, or if the session id has not a open connection, a HTTP 403 code will be returned to the client.
