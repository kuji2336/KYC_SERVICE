
# RUN APPLICATION



1. `npm run start `,
2. Application will run on Port `9000`,
3. Navigate to `.netlify/functions/api/${route_name}` directory.
4. You can Live test endpoint via PostMan `http://${host}/.netlify/functions/api/${route_name}`


## Build and Deployments on Netlify

To build project locally run `npm run build`

**For deployment on Netlify import project from Github repository, and point build command, in this case build command will be `npm run build` and also point Publish directory to the`dist/` folder, fill environment variables section with proper values (You can import env variables from `.env` file in root directory)**




