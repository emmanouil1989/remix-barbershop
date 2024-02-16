# remix-card-app

- Need DATABASE URL on .env to point to local mysql
- Data base url should look like this
  `mysql://username:password@localhost:3307/databaseName`
- `docker run -d --name containerName -e MYSQL_ROOT_PASSWORD=password -p 3307:3306 mysql`
- SESSION_SECRET set on .env
- ENCRYPTION_KEY set on .env
- Run `npm install`
- Run `npm run seed` to add mock data to database
- Admin mock email `admin@gmail.com` and password`password1`
