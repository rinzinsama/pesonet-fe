# PESONET FRONTEND

Frontend scripts for pesonet project.

### lite-server <Optional>

If you want to host your application locally like what apache/nginx does, you may use lite-server. Please check [lite-server](https://github.com/johnpapa/lite-server "lite-server") for installation details.
Make sure to create a "bs-config.json" file with the correct configuration to make this command work.
Also align the url and port used in the .env file or else there will be a mismatch on the server and your app.

Use this command to run server:

```
npm run start
```

## Run Commands

```
npm run watch //watch mode
npm run prod //production mode
```

### watch

This watches the changes made on the vue worksapce and automatically regenerates assets

### prod

This doesn't watch files but generates production grade assets. It minifies css/js assets during the process

## Author

Christian Miranda

## License

This project is licensed - see the [LICENSE.md](LICENSE.md) file for details
