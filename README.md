build
```bash
docker build . -t ctnelson1997/cs571-s24-hw11-api
docker push ctnelson1997/cs571-s24-hw11-api
```

run
```bash
docker pull ctnelson1997/cs571-s24-hw11-api
docker run --name=cs571_s24_hw11_api -d --restart=always -p 58111:58111 -v /cs571/s24/hw11:/cs571 ctnelson1997/cs571-s24-hw11-api
```

run_fa
```bash
docker pull ctnelson1997/cs571-s24-hw11-api
docker run --name=cs571_fa_s24_hw11_api -d --restart=always -p 59111:58111 -v /cs571_fa/s24/hw11:/cs571 ctnelson1997/cs571-s24-hw11-api
```