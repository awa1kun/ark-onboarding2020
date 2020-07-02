FROM nginx:latest
ENV NGINX_PORT 80
RUN apt-get update
RUN apt-get install -y ssh
RUN service ssh start
# PermitRootLogin yes
# passwd rootでパスワード変更