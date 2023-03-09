# Getting Started with Calendly example Buzzword CRM with React Compile

This project was forked from  with [BuzzwordCRM](https://github.com/calendly/buzzwordcrm).

## Deploy Scripts

Rather than use esbuild, this project uses the React bundler - Webpack - to bundle the React application components
and static files into a static build folder, which is then served by the express application.

The express server and the React application both run on the same port - 3000.  When we hit the main login
path or root of the application at '/' that serves the React static files.  When we hit either the /oauth or
/api prefixes, we are using the express server.

To start the application run ./my.sh from the command line.  This will start the express server AND run 
'npm run build' in the reactcalendly folder, packaging up any changes you've made in the react app and 
creating a new static bundle.

Nodemon will then be up and running your running on port 3000.

### Changes from Buzzword CRM

Buzzword CRM used React components, but, not the React bundler.  Since I am a React guy, I just figured, I 
would re-work the start process.   Along with that, we replaced the foreman procdev file with a standard
shell script my.sh.

The static assets from the server's public folder, were moved into the React app's public directory.

The views folder and handlebars view engine were removed from the project, because they are being handled
by the React bundle now.

### Environment Variables 

Enter your Client ID and Secret into either the .env file or a .env.local file as below:

CLIENT_ID=youridhere
CLIENT_SECRET=yoursecrethere

### CSS Changes

Minimal CSS changes


