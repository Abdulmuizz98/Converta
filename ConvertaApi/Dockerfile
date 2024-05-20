# Base image
FROM --platform=$BUILDPLATFORM  mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG TARGETARCH
ENV APP_HOME=/usr/src/app \
    APP_SRC=/usr/src/source
WORKDIR $APP_SRC

# copy csproj and restore as distinct layers
COPY *.csproj .
RUN dotnet restore -a $TARGETARCH

# copy everything else and build app
COPY . .
RUN dotnet publish -a $TARGETARCH --no-restore -o $APP_HOME


# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
EXPOSE 8080
WORKDIR $APP_HOME
COPY --from=build $APP_HOME .
CMD ["./usr/src/app/ConvertaApi"]