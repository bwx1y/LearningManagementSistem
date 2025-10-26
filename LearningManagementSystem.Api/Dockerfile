FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["LearningManagementSystem.Api/LearningManagementSystem.Api.csproj", "LearningManagementSystem.Api/"]
COPY ["LearningManagementSystem.Application/LearningManagementSystem.Application.csproj", "LearningManagementSystem.Application/"]
COPY ["LearningManagementSystem.Domain/LearningManagementSystem.Domain.csproj", "LearningManagementSystem.Domain/"]
COPY ["LearningManagementSystem.Infrastructure/LearningManagementSystem.Infrastructure.csproj", "LearningManagementSystem.Infrastructure/"]
RUN dotnet restore "LearningManagementSystem.Api/LearningManagementSystem.Api.csproj"
COPY . .
WORKDIR "/src/LearningManagementSystem.Api"
RUN dotnet build "./LearningManagementSystem.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./LearningManagementSystem.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LearningManagementSystem.Api.dll"]
