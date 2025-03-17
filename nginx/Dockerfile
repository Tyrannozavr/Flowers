FROM nginx:1.25

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
COPY flourum.ru /etc/letsencrypt/live/flourum.ru
RUN chmod 600 /etc/letsencrypt/live/flourum.ru/privkey.pem
RUN chmod 644 /etc/letsencrypt/live/flourum.ru/fullchain.pem
RUN chmod 644 /etc/letsencrypt/live/flourum.ru/cert.pem
RUN chmod 644 /etc/letsencrypt/live/flourum.ru/chain.pem
RUN chmod 644 /etc/letsencrypt/live/flourum.ru/README
