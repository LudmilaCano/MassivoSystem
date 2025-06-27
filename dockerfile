# Imagen base para runtime .NET 8
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Imagen para build con .NET 8 SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Instalar Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Copiar archivos de proyecto .NET
COPY ["MassivoProject.Server/*.csproj", "MassivoProject.Server/"]
COPY ["Application/*.csproj", "Application/"]
COPY ["Domain/*.csproj", "Domain/"]
COPY ["Infraestructure/*.csproj", "Infraestructure/"]

# Restaurar dependencias .NET
WORKDIR /src/MassivoProject.Server
RUN dotnet restore

# Copiar todo el código
WORKDIR /src
COPY . .

# Build React
WORKDIR /src/massivoproject.client
RUN npm install
RUN npm run build

# Build .NET
WORKDIR /src/MassivoProject.Server
RUN dotnet build -c Release -o /app/build

# Publicar
FROM build AS publish
WORKDIR /src/MassivoProject.Server
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Imagen final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MassivoProject.Server.dll"]