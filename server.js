const express = require('express');
const path = require('path');

const app = express();

// Caminho para os arquivos compilados do Angular
const appPath = 'C:\\FRONT_END\\dist\\api\\browser';

// Servir arquivos estáticos do Angular
app.use(express.static(appPath));

// Redirecionar todas as rotas desconhecidas para o index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(appPath, 'index.html'));
});

// Porta onde o servidor será executado
const PORT = process.env.PORT || 8082;

// IP do servidor (use 0.0.0.0 para aceitar conexões externas)
const HOST = '192.168.15.7';

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
