# Frontend Dockerfile
FROM nginx:alpine

# نسخ ملفات التطبيق
COPY . /usr/share/nginx/html

# نسخ ملف تكوين Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# كشف المنفذ
EXPOSE 80

# أمر التشغيل
CMD ["nginx", "-g", "daemon off;"]