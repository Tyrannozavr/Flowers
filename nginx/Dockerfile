FROM nginx:1.25

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
COPY proxy_params /etc/nginx/proxy_params
COPY flourum.ru /etc/letsencrypt/live/flourum.ru
COPY flourum.ru /etc/letsencrypt/live/docroom.ru

