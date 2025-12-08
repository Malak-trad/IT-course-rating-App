# Backend Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# تثبيت أدوات التطوير
RUN apk add --no-cache bash

# نسخ ملف package.json وتثبيت dependencies
COPY package*.json ./
RUN npm install --only=production

# نسخ باقي ملفات التطبيق
COPY . .

# إنشاء مجلد uploads إذا لم يكن موجوداً
RUN mkdir -p uploads/avatars

# كشف المنفذ
EXPOSE 5000

# أمر التشغيل
CMD ["npm", "start"]