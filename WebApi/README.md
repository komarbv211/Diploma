# makeup-asp

Create docker hub repository - publish
```
docker build -t makeup-asp-api . 
docker run -it --rm -p 5817:8080 --name makeup-asp_container makeup-asp-api
docker run -d --restart=always --name makeup-asp_container -p 5817:8080 makeup-asp-api
docker run -d --restart=always -v d:/volumes/makeup-asp/images:/app/Uploaded --name makeup-asp_container -p 5817:8080 makeup-asp-api
docker run -d --restart=always -v /volumes/makeup-asp/images:/app/Uploaded --name makeup-asp_container -p 5817:8080 makeup-asp-api
docker ps -a
docker stop makeup-asp_container
docker rm makeup-asp_container

docker images --all
docker rmi makeup-asp-api

docker login
docker tag makeup-asp-api:latest novakvova/makeup-asp-api:latest
docker push novakvova/makeup-asp-api:latest

docker pull novakvova/makeup-asp-api:latest
docker ps -a
docker run -d --restart=always --name makeup-asp_container -p 5817:8080 novakvova/makeup-asp-api

docker run -d --restart=always -v /volumes/makeup-asp/images:/app/Uploaded --name makeup-asp_container -p 5817:8080 novakvova/makeup-asp-api


docker pull novakvova/makeup-asp-api:latest
docker images --all
docker ps -a
docker stop makeup-asp_container
docker rm makeup-asp_container
docker run -d --restart=always --name makeup-asp_container -p 5817:8080 novakvova/makeup-asp-api
```

```nginx options /etc/nginx/sites-available/default
server {
    server_name   makeup.itstep.click *.makeup.itstep.click;
    client_max_body_size 200M;
    location / {
       proxy_pass         http://localhost:5817;
       proxy_http_version 1.1;
       proxy_set_header   Upgrade $http_upgrade;
       proxy_set_header   Connection keep-alive;
       proxy_set_header   Host $host;
       proxy_cache_bypass $http_upgrade;
       proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header   X-Forwarded-Proto $scheme;
    }
}


sudo systemctl restart nginx
certbot
```
