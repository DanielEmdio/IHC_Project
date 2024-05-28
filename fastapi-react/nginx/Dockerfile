# nginx docker image
FROM nginx:1.25.4

# remove the default nginx config file
RUN rm /etc/nginx/conf.d/default.conf

# copy the custom config file
COPY nginx.conf /etc/nginx/conf.d

# expose port 80
# EXPOSE 80

# start nginx 
CMD ["nginx", "-g", "daemon off;"]
