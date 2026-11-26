# ========== 构建阶段：使用 Maven 镜像编译打包 ==========
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

# 使用阿里云 Maven 镜像，避免容器内访问 Maven Central 过慢导致构建失败
COPY docker/maven-settings.xml /root/.m2/settings.xml

# 先单独拷贝 pom.xml 并预下载依赖，利用 Docker 层缓存加速后续构建
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

# 再拷贝源码并打包（跳过测试，测试需要额外的数据库环境）
COPY src ./src
RUN mvn -B -q -DskipTests package

# 独立验证目标：docker build --target tests -t cinema-backend-tests ./backend
FROM build AS tests
RUN mvn -B -q -Dtest=OrderMessagingTest,ProductCacheTest,TicketOrderTest test

# ========== 运行阶段：只保留 JRE 和可执行 jar ==========
FROM eclipse-temurin:17-jre
WORKDIR /app
ENV TZ=Asia/Shanghai

COPY --from=build /build/target/fuwuwaibao-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
