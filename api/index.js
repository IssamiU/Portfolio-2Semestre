const express = require('express');
const mysql = require('mysql2');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper para criar conexão por request
function getDbConnection() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
}
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/dbtest', (req, res) => {
  const db = getDbConnection();
  db.connect(err => {
    if (err) {
      return res.status(500).send('Erro ao conectar ao MySQL: ' + err.message);
    }
    db.query('SELECT 1', (err, results) => {
      db.end();
      if (err) return res.status(500).send('Erro na query: ' + err.message);
      res.send('Conexão e query MySQL OK!');
    });
  });
});

// Rota principal
app.get('/', (req, res) => {
    const db = getDbConnection();
    const sqlProjetos = 'SELECT * FROM projetos WHERE ativo = TRUE ORDER BY ordem_exibicao ASC';
    const sqlPerfil = 'SELECT * FROM perfil WHERE ativo = TRUE LIMIT 1';
    const sqlHabilidades = 'SELECT * FROM habilidades WHERE ativo = TRUE ORDER BY ordem_exibicao ASC';
    const sqlCertificados = 'SELECT * FROM certificados WHERE ativo = TRUE ORDER BY ordem_exibicao ASC';
    const sqlContatos = 'SELECT * FROM contatos WHERE ativo = TRUE ORDER BY ordem_exibicao ASC';

    Promise.all([
        new Promise((resolve, reject) => {
            db.query(sqlProjetos, (err, results) => err ? reject(err) : resolve(results));
        }),
        new Promise((resolve, reject) => {
            db.query(sqlPerfil, (err, results) => err ? reject(err) : resolve(results[0] || {}));
        }),
        new Promise((resolve, reject) => {
            db.query(sqlHabilidades, (err, results) => err ? reject(err) : resolve(results));
        }),
        new Promise((resolve, reject) => {
            db.query(sqlCertificados, (err, results) => err ? reject(err) : resolve(results));
        }),
        new Promise((resolve, reject) => {
            db.query(sqlContatos, (err, results) => err ? reject(err) : resolve(results));
        })
    ])
    .then(([projetos, perfil, habilidades, certificados, contatos]) => {
        db.end();
        res.render('index', {
            tituloPagina: 'Portfólio de Issami Umeoka',
            projetos,
            perfil,
            habilidades,
            certificados,
            contatos
        });
    })
    .catch(err => {
        db.end();
        console.error('Erro ao buscar dados:', err);
        res.render('index', {
            tituloPagina: 'Portfólio de Issami Umeoka',
            projetos: [],
            perfil: {},
            habilidades: [],
            certificados: [],
            contatos: []
        });
    });
});

// CRUD PROJETOS
app.post('/projetos', (req, res) => {
    const db = getDbConnection();
    const { titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao } = req.body;
    const sql = 'INSERT INTO projetos (titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao], (err, result) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, titulo, descricao });
    });
});

app.get('/projetos', (req, res) => {
    const db = getDbConnection();
    db.query('SELECT * FROM projetos', (err, results) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/projetos/:id', (req, res) => {
    const db = getDbConnection();
    db.query('SELECT * FROM projetos WHERE id = ?', [req.params.id], (err, results) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.put('/projetos/:id', (req, res) => {
    const db = getDbConnection();
    const { titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao } = req.body;
    const sql = 'UPDATE projetos SET titulo = ?, descricao = ?, tecnologias = ?, atuacao = ?, github_url = ?, imagem_url = ?, video_url = ?, tipo_midia = ?, semestre = ?, ordem_exibicao = ? WHERE id = ?';
    db.query(sql, [titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao, req.params.id], (err) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Projeto atualizado com sucesso' });
    });
});

app.delete('/projetos/:id', (req, res) => {
    const db = getDbConnection();
    db.query('DELETE FROM projetos WHERE id = ?', [req.params.id], (err) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Projeto excluído com sucesso' });
    });
});

// CRUD PERFIL
app.post('/perfil', (req, res) => {
    const db = getDbConnection();
    const { nome, ano_nascimento, curso_atual, instituicao, previsao_conclusao, formacao_anterior, instituicao_anterior, ano_conclusao_anterior, biografia, objetivo_profissional, caracteristicas_pessoais, foto_url, curriculo_url } = req.body;
    const sql = 'INSERT INTO perfil (nome, ano_nascimento, curso_atual, instituicao, previsao_conclusao, formacao_anterior, instituicao_anterior, ano_conclusao_anterior, biografia, objetivo_profissional, caracteristicas_pessoais, foto_url, curriculo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome, ano_nascimento, curso_atual, instituicao, previsao_conclusao, formacao_anterior, instituicao_anterior, ano_conclusao_anterior, biografia, objetivo_profissional, caracteristicas_pessoais, foto_url, curriculo_url], (err, result) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, nome });
    });
});

app.get('/perfil', (req, res) => {
    const db = getDbConnection();
    db.query('SELECT * FROM perfil', (err, results) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/perfil/:id', (req, res) => {
    const db = getDbConnection();
    db.query('SELECT * FROM perfil WHERE id = ?', [req.params.id], (err, results) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.put('/perfil/:id', (req, res) => {
    const db = getDbConnection();
    const { nome, ano_nascimento, curso_atual, instituicao, previsao_conclusao, formacao_anterior, instituicao_anterior, ano_conclusao_anterior, biografia, objetivo_profissional, caracteristicas_pessoais, foto_url, curriculo_url } = req.body;
    const sql = 'UPDATE perfil SET nome = ?, ano_nascimento = ?, curso_atual = ?, instituicao = ?, previsao_conclusao = ?, formacao_anterior = ?, instituicao_anterior = ?, ano_conclusao_anterior = ?, biografia = ?, objetivo_profissional = ?, caracteristicas_pessoais = ?, foto_url = ?, curriculo_url = ? WHERE id = ?';
    db.query(sql, [nome, ano_nascimento, curso_atual, instituicao, previsao_conclusao, formacao_anterior, instituicao_anterior, ano_conclusao_anterior, biografia, objetivo_profissional, caracteristicas_pessoais, foto_url, curriculo_url, req.params.id], (err) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Perfil atualizado com sucesso' });
    });
});

app.delete('/perfil/:id', (req, res) => {
    const db = getDbConnection();
    db.query('DELETE FROM perfil WHERE id = ?', [req.params.id], (err) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Perfil excluído com sucesso' });
    });
});

// CRUD HABILIDADES
app.post('/habilidades', (req, res) => {
    const db = getDbConnection();
    const { nome, icone_url, cor_background, ordem_exibicao } = req.body;
    const sql = 'INSERT INTO habilidades (nome, icone_url, cor_background, ordem_exibicao) VALUES (?, ?, ?, ?)';
    db.query(sql, [nome, icone_url, cor_background, ordem_exibicao], (err, result) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, nome });
    });
});

app.get('/habilidades', (req, res) => {
    const db = getDbConnection();
    db.query('SELECT * FROM habilidades', (err, results) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/habilidades/:id', (req, res) => {
    const db = getDbConnection();
    db.query('SELECT * FROM habilidades WHERE id = ?', [req.params.id], (err, results) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.put('/habilidades/:id', (req, res) => {
    const db = getDbConnection();
    const { nome, icone_url, cor_background, ordem_exibicao } = req.body;
    const sql = 'UPDATE habilidades SET nome = ?, icone_url = ?, cor_background = ?, ordem_exibicao = ? WHERE id = ?';
    db.query(sql, [nome, icone_url, cor_background, ordem_exibicao, req.params.id], (err) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Habilidade atualizada com sucesso' });
    });
});

app.delete('/habilidades/:id', (req, res) => {
    const db = getDbConnection();
    db.query('DELETE FROM habilidades WHERE id = ?', [req.params.id], (err) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Habilidade excluída com sucesso' });
    });
});

// CRUD CERTIFICADOS
app.post('/certificados', (req, res) => {
    const db = getDbConnection();
    const { titulo, descricao, imagem_url, documento_url, data_obtencao, ordem_exibicao } = req.body;
    const sql = 'INSERT INTO certificados (titulo, descricao, imagem_url, documento_url, data_obtencao, ordem_exibicao) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [titulo, descricao, imagem_url, documento_url, data_obtencao, ordem_exibicao], (err, result) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, titulo });
    });
});

app.get('/certificados', (req, res) => {
    const db = getDbConnection();
    db.query('SELECT * FROM certificados', (err, results) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/certificados/:id', (req, res) => {
    const db = getDbConnection();
    db.query('SELECT * FROM certificados WHERE id = ?', [req.params.id], (err, results) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.put('/certificados/:id', (req, res) => {
    const db = getDbConnection();
    const { titulo, descricao, imagem_url, documento_url, data_obtencao, ordem_exibicao } = req.body;
    const sql = 'UPDATE certificados SET titulo = ?, descricao = ?, imagem_url = ?, documento_url = ?, data_obtencao = ?, ordem_exibicao = ? WHERE id = ?';
    db.query(sql, [titulo, descricao, imagem_url, documento_url, data_obtencao, ordem_exibicao, req.params.id], (err) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Certificado atualizado com sucesso' });
    });
});

app.delete('/certificados/:id', (req, res) => {
    const db = getDbConnection();
    db.query('DELETE FROM certificados WHERE id = ?', [req.params.id], (err) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Certificado excluído com sucesso' });
    });
});

// CRUD CONTATOS
app.post('/contatos', (req, res) => {
    const db = getDbConnection();
    const { tipo, valor, icone_url, ordem_exibicao } = req.body;
    const sql = 'INSERT INTO contatos (tipo, valor, icone_url, ordem_exibicao) VALUES (?, ?, ?, ?)';
    db.query(sql, [tipo, valor, icone_url, ordem_exibicao], (err, result) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, tipo, valor });
    });
});

app.get('/contatos', (req, res) => {
    const db = getDbConnection();
    db.query('SELECT * FROM contatos', (err, results) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/contatos/:id', (req, res) => {
    const db = getDbConnection();
    db.query('SELECT * FROM contatos WHERE id = ?', [req.params.id], (err, results) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.put('/contatos/:id', (req, res) => {
    const db = getDbConnection();
    const { tipo, valor, icone_url, ordem_exibicao } = req.body;
    const sql = 'UPDATE contatos SET tipo = ?, valor = ?, icone_url = ?, ordem_exibicao = ? WHERE id = ?';
    db.query(sql, [tipo, valor, icone_url, ordem_exibicao, req.params.id], (err) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Contato atualizado com sucesso' });
    });
});

app.delete('/contatos/:id', (req, res) => {
    const db = getDbConnection();
    db.query('DELETE FROM contatos WHERE id = ?', [req.params.id], (err) => {
        db.end();
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Contato excluído com sucesso' });
    });
});

module.exports = serverless(app);
