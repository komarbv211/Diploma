# React + TypeScript + Vite

npm install @reduxjs/toolkit react-redux


cd client_app
npm run dev 

npm install react-input-mask

npm install --save-dev @types/react-input-mask


# makeup-client-asp

Create docker hub repository - publish
```
docker build -t makeup-client . 
docker run -it --rm -p 5982:80 --name makeup-client_container makeup-client
docker run -d --restart=always --name makeup-client_container -p 5982:80 makeup-client
docker run -d --restart=always -v d:/volumes/makeup-asp/images:/app/Uploaded --name makeup-client_container -p 5982:80 makeup-client
docker run -d --restart=always -v /volumes/makeup-asp/images:/app/Uploaded --name makeup-client_container -p 5982:80 makeup-client
docker ps -a
docker stop makeup-client_container
docker rm makeup-client_container

docker images --all
docker rmi makeup-client

docker login
docker tag makeup-client:latest novakvova/makeup-client:latest
docker push novakvova/makeup-client:latest

docker pull novakvova/makeup-client:latest
docker ps -a
docker run -d --restart=always --name makeup-client_container -p 5982:80 novakvova/makeup-client

docker run -d --restart=always -v /volumes/makeup-asp/images:/app/Uploaded --name makeup-client_container -p 5982:80 novakvova/makeup-client


docker pull novakvova/makeup-client:latest
docker images --all
docker ps -a
docker stop makeup-client_container
docker rm makeup-client_container
docker run -d --restart=always --name makeup-client_container -p 5982:80 novakvova/makeup-client
```

```nginx options /etc/nginx/sites-available/default
server {
    server_name   makeup.itstep.click *.makeup.itstep.click;
    client_max_body_size 200M;
    location / {
       proxy_pass         http://localhost:5982;
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

