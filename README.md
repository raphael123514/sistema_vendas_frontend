# Sistema de Vendas Frontend

Este projeto é um frontend em Vue 3 + Vite para o sistema de vendas.

---

## Requisitos

- Node.js 18+
- Docker e Docker Compose (recomendado para ambiente de produção e desenvolvimento)
- Backend rodando e acessível (ver variável `API_HOST`)

---

## Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias. Exemplo:

```env
API_HOST=laravel.test
BASE_URL=http://localhost:5173
```

- `API_HOST`: Host do backend Laravel (pode ser um hostname Docker ou IP).
- `BASE_URL`: URL base do frontend (ajuste conforme necessário).

---

## Subindo o Projeto em Desenvolvimento

O modo recomendado é via Docker Compose:

```sh
docker compose -f docker-compose.dev.yml up --build
```

- O frontend ficará disponível em [http://localhost:5173](http://localhost:5173)
- O código-fonte é montado como volume, permitindo hot reload.

Ou, se preferir rodar localmente (fora do Docker):

```sh
npm install
npm run dev
```

---

## Subindo o Projeto em Produção

Para build e servir em produção via Docker:

```sh
docker compose up --build
```

- O frontend será servido na porta 8080 (ajuste no `docker-compose.yml` se necessário).

Ou, para build local:

```sh
npm install
npm run build
# Sirva a pasta dist/ com um servidor estático de sua preferência
```

---

## Scripts Úteis

- **Testes unitários:**
  ```sh
  npm run test:unit
  ```
- **Lint:**
  ```sh
  npm run lint
  ```

- **Subir o docker com npm:**
  ```sh
  npm run dev:docker
  ```

---

## Observações

- Sempre ajuste as variáveis do `.env` conforme o ambiente (dev/prod).
- O frontend espera que o backend esteja acessível pelo valor de `API_HOST`.
- Para desenvolvimento, recomenda-se usar o Docker Compose para garantir compatibilidade de ambiente.
- Se adicionar novas variáveis de ambiente, lembre-se de atualizar este README.

---
