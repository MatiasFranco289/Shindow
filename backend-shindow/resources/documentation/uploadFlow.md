# Upload flow

When a client reach the endpoint to upload a file to the server the file is sent from the client to this backend. After the file is in this backend a second transfer begins from this backend to the SSH server.

The progress of the upload is sent to client using Socket.IO. When the first tranfer is taking place (from a client to this backend) the progress will be between 0 and 50%. 50% meaning the file is already in this backend and the first part of the transfer has ended.
When the file is being sended from this backend to the actual SSH server the progress will be between 50% and 100%. 100% meaning the file is already in the SSH server.
When the file is fully loaded in the SSH server the temporal file in deleted from this backend.
