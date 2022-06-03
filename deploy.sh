docker stop pesonet-fe
docker rm pesonet-fe
docker rmi pesonet

docker build -t pesonet .
docker run -d -p 82:82 --name pesonet-fe pesonet
docker image prune -f