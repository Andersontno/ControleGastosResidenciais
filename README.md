# ControleGastosResidenciais

## **Execução Rápida com Docker(Recomendado)**
### Pré-requisitos
- Docker

### Executar
```powershell
# Baixar e iniciar todo ambiente (Terminal na pasta raiz)
docker-compose up --build

# Executar em background
docker-compose up -d --build

# Parar todos serviços
docker-compose down

# Parar e limpar volumes (reset completo)
docker-compose down -v
```

## **Execução Local (sem Docker)**
### Pré-requisitos
- PostgresSQL
- .NET 10 SDK
- Node.js 18+

### Banco de dados
- PostgresSQL instalado e configurado na porta 5432

### Executar API
```powershell
# Entrar na pasta da API
cd ControleGastosResidenciais.Api

# Restaurar dependências
dotnet restore

# Executar aplicação
dotnet run
```

### Executar Frontend
```powershell
# Entrar na pasta do Frontend (novo terminal)
cd ControleGastosResidenciais.Frontend

# Instalar dependências
npm install

# Executar aplicação frontend
npm start
```

## **Acessos**
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8080
- **Banco**: localhost:5432

### **Observação:**
As portas são as mesmas para execução com Docker e execução local.