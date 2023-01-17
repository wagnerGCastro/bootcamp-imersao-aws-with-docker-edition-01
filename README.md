## Base project for the AWS Immersion with Docker

### Event period: January 16th to 22nd, 2023 (Online and live at 8pm)

#### To run the migrations in the container

```
docker-compose exec server bash -c 'npx sequelize db:migrate'
```
