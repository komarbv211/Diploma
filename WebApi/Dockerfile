# Stage 1: Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# Копіюємо проект і відновлюємо залежності
COPY ["WebApiDiploma/WebApiDiploma.csproj", "WebApiDiploma/"]
RUN dotnet restore "WebApiDiploma/WebApiDiploma.csproj"

# Копіюємо всі файли і будуємо додаток
COPY . .
WORKDIR /source/WebApiDiploma
RUN dotnet publish -c Release -o /app

# Stage 2: Final image for runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# Встановлюємо необхідні пакети для підключення до PostgreSQL
WORKDIR /app
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    lsb-release \
    && echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -c | awk '{print $2}')-pgdg main" > /etc/apt/sources.list.d/pgdg.list && \
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && \
    apt-get update && \
    apt-get install -y postgresql-client-17 && \
    apt-get remove -y wget gnupg lsb-release && \
    apt-get clean

# Налаштовуємо змінні середовища для підключення до бази даних
ENV CONNECTIONSTRING="Server=ep-long-firefly-a2qp0hj6-pooler.eu-central-1.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=npg_wQjgN89tVlTc"

# Копіюємо додаток з етапу побудови
COPY --from=build /app .

# Запускаємо додаток
ENTRYPOINT ["dotnet", "WebApiDiploma.dll"]
