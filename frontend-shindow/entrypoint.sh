#!/bin/sh

echo "window.env = {" > ./public/env.js
echo "  NEXT_PUBLIC_SECRET: \"${NEXT_PUBLIC_SECRET}\"," >> ./public/env.js
echo "  NEXT_PUBLIC_KEY_FILE_MAX_SIZE: ${NEXT_PUBLIC_KEY_FILE_MAX_SIZE}," >> ./public/env.js
echo "  NEXT_PUBLIC_TZ: \"${NEXT_PUBLIC_TZ}\"," >> ./public/env.js
echo "  NEXT_PUBLIC_BACK_BASE_URL: \"${NEXT_PUBLIC_BACK_BASE_URL}\"," >> ./public/env.js
echo "  NEXT_PUBLIC_API_BASE_URL: \"${NEXT_PUBLIC_API_BASE_URL}\"," >> ./public/env.js
echo "  NEXT_PUBLIC_INITIAL_PATH: \"${NEXT_PUBLIC_INITIAL_PATH}\"," >> ./public/env.js
echo "  NEXT_PUBLIC_CLIENT_BASE_URL: \"${NEXT_PUBLIC_CLIENT_BASE_URL}\"" >> ./public/env.js
echo "};" >> ./public/env.js

exec "$@"
