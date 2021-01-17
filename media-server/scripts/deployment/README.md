# Docker Deployment

Steps to run this

- Edit the `docker-compose.yml` file
  - Set the AUTH0_DOMAIN and AUTH0_CLIENT_ID values
  - Choose a free local port and change it from 4700
- Run `./updateAndRestartDocker.sh`
  - NOTE: This assumes docker is run with sudo, edit the file and remove the
    sudo calls if not
- Add an SSL termination server in front of this container
