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

# Копіюємо додаток з етапу побудови
COPY --from=build /app .

# Запускаємо додаток
ENTRYPOINT ["dotnet", "WebApiDiploma.dll"]
