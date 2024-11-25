./init-db.sh
docker build -t rodgeradr/mehc .
# docker run -p 3000:3000 mehc
echo $DOCKER_TOKEN | docker login -u rodgeradr --password-stdin
docker push rodgeradr/mehc