# Use the official .NET 10 SDK image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["ControleGastosResidenciais.Api.csproj", "."]
RUN dotnet restore "ControleGastosResidenciais.Api.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "ControleGastosResidenciais.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ControleGastosResidenciais.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Set the environment to Development for easier testing
ENV ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["dotnet", "ControleGastosResidenciais.Api.dll"]