# 第一阶段：构建前端 React 应用
FROM node:20 AS frontend-builder
WORKDIR /app
COPY front_end/* /app/
# 在构建阶段之前，删除 node_modules 和 package-lock.json
RUN rm -rf node_modules package-lock.json
RUN npm install
RUN npm run build

# 第二阶段：构建后端 Node 应用
FROM node:20 AS backend-builder
WORKDIR /app
COPY back_end/* /app/
RUN npm install

# 第三阶段：使用 Nginx 作为反向代理服务器
FROM nginx:alpine
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# 将后端构建产物复制到镜像中
COPY --from=backend-builder /app /usr/share/nginx/html/api

# 暴露前端和后端端口
EXPOSE 3000 88

# 启动 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]
