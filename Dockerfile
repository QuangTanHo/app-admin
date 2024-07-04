# # Sử dụng image gốc là Node.js phiên bản LTS
# FROM node:lts

# # Thiết lập thư mục làm việc trong container
# WORKDIR /app

# # Sao chép file package.json và package-lock.json vào thư mục làm việc
# COPY package*.json ./

# # Cài đặt các dependencies của ứng dụng
# RUN npm install

# # Sao chép toàn bộ mã nguồn của ứng dụng vào thư mục làm việc
# COPY . .

# # Build ứng dụng Angular
# RUN npm run build --prod

# # Expose cổng 4200 để truy cập ứng dụng từ bên ngoài
# EXPOSE 4200

# # Khởi động ứng dụng Angular khi container được chạy
# CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]

# server
# Sử dụng base image cho Node.js
FROM node:latest as build-stage

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn của ứng dụng vào thư mục làm việc
COPY . .

# Xây dựng ứng dụng Angular
RUN npm run build --prod

# Sử dụng nginx làm server cho ứng dụng
FROM nginx:alpine

# Sao chép các tệp tĩnh từ giai đoạn xây dựng vào thư mục default của nginx
# COPY --from=build-stage /app/dist/ /root/nong-san/app-admin/dist/app-admin
COPY --from=build-stage /app/dist/app-admin /usr/share/nginx/html

# Thiết lập cấu hình tùy chỉnh cho nginx
# COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Mở cổng 80 để truy cập vào ứng dụng
EXPOSE 80

# Khởi động nginx khi container chạy
CMD ["nginx", "-g", "daemon off;"]