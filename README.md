# ControleGastosResidenciais

## **Execução Rápida com Docker**

```powershell
# Baixar e iniciar todo ambiente (API + PostgreSQL)
docker-compose up --build

# Executar em background
docker-compose up -d --build

# Parar todos serviços
docker-compose down

# Parar e limpar volumes (reset completo)
docker-compose down -v
```

## **Execução Local (sem Docker)**

```powershell
# Entrar na pasta da API
cd ControleGastosResidenciais.Api

# Restaurar dependências
dotnet restore

# Executar aplicação
dotnet run
```