const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

// Rota principal
app.get('/', (req, res) => {  
    const sqlProjetos = 'SELECT * FROM projetos WHERE ativo = TRUE ORDER BY ordem_exibicao ASC';
    const sqlPerfil = 'SELECT * FROM perfil WHERE ativo = TRUE LIMIT 1';
    const sqlHabilidades = 'SELECT * FROM habilidades WHERE ativo = TRUE ORDER BY ordem_exibicao ASC';
    const sqlCertificados = 'SELECT * FROM certificados WHERE ativo = TRUE ORDER BY ordem_exibicao ASC';
    const sqlContatos = 'SELECT * FROM contatos WHERE ativo = TRUE ORDER BY ordem_exibicao ASC';
    
    Promise.all([
        new Promise((resolve, reject) => {
            db.query(sqlProjetos, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(sqlPerfil, (err, results) => {
                if (err) reject(err);
                else resolve(results[0] || {});
            });
        }),
        new Promise((resolve, reject) => {
            db.query(sqlHabilidades, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(sqlCertificados, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(sqlContatos, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        })
    ]).then(([projetos, perfil, habilidades, certificados, contatos]) => {
        res.render('index', {
            tituloPagina: 'Portfólio de Issami Umeoka',
            projetos,
            perfil,
            habilidades,
            certificados,
            contatos
        });
    }).catch(err => {
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

// ===== CRUD PROJETOS =====

// CREATE projeto
app.post('/projetos', (req, res) => {
    const { titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao } = req.body;
    const sql = 'INSERT INTO projetos (titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, titulo, descricao });
    });
});

// READ todos os projetos
app.get('/projetos', (req, res) => {
    db.query('SELECT * FROM projetos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// READ projeto por ID
app.get('/projetos/:id', (req, res) => {
    db.query('SELECT * FROM projetos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// UPDATE projeto
app.put('/projetos/:id', (req, res) => {
    const { titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao } = req.body;
    const sql = 'UPDATE projetos SET titulo = ?, descricao = ?, tecnologias = ?, atuacao = ?, github_url = ?, imagem_url = ?, video_url = ?, tipo_midia = ?, semestre = ?, ordem_exibicao = ? WHERE id = ?';
    db.query(sql, [titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Projeto atualizado com sucesso' });
    });
});

// DELETE projeto
app.delete('/projetos/:id', (req, res) => {
    db.query('DELETE FROM projetos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Projeto excluído com sucesso' });
    });
});

// ===== CRUD PERFIL =====

// CREATE perfil
app.post('/perfil', (req, res) => {
    const { nome, ano_nascimento, curso_atual, instituicao, previsao_conclusao, formacao_anterior, instituicao_anterior, ano_conclusao_anterior, biografia, objetivo_profissional, caracteristicas_pessoais, foto_url, curriculo_url } = req.body;
    const sql = 'INSERT INTO perfil (nome, ano_nascimento, curso_atual, instituicao, previsao_conclusao, formacao_anterior, instituicao_anterior, ano_conclusao_anterior, biografia, objetivo_profissional, caracteristicas_pessoais, foto_url, curriculo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome, ano_nascimento, curso_atual, instituicao, previsao_conclusao, formacao_anterior, instituicao_anterior, ano_conclusao_anterior, biografia, objetivo_profissional, caracteristicas_pessoais, foto_url, curriculo_url], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, nome });
    });
});

// READ todos os perfis
app.get('/perfil', (req, res) => {
    db.query('SELECT * FROM perfil', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// READ perfil por ID
app.get('/perfil/:id', (req, res) => {
    db.query('SELECT * FROM perfil WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// UPDATE perfil
app.put('/perfil/:id', (req, res) => {
    const { nome, ano_nascimento, curso_atual, instituicao, previsao_conclusao, formacao_anterior, instituicao_anterior, ano_conclusao_anterior, biografia, objetivo_profissional, caracteristicas_pessoais, foto_url, curriculo_url } = req.body;
    const sql = 'UPDATE perfil SET nome = ?, ano_nascimento = ?, curso_atual = ?, instituicao = ?, previsao_conclusao = ?, formacao_anterior = ?, instituicao_anterior = ?, ano_conclusao_anterior = ?, biografia = ?, objetivo_profissional = ?, caracteristicas_pessoais = ?, foto_url = ?, curriculo_url = ? WHERE id = ?';
    db.query(sql, [nome, ano_nascimento, curso_atual, instituicao, previsao_conclusao, formacao_anterior, instituicao_anterior, ano_conclusao_anterior, biografia, objetivo_profissional, caracteristicas_pessoais, foto_url, curriculo_url, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Perfil atualizado com sucesso' });
    });
});

// DELETE perfil
app.delete('/perfil/:id', (req, res) => {
    db.query('DELETE FROM perfil WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Perfil excluído com sucesso' });
    });
});

// ===== CRUD HABILIDADES =====

// CREATE habilidade
app.post('/habilidades', (req, res) => {
    const { nome, icone_url, cor_background, ordem_exibicao } = req.body;
    const sql = 'INSERT INTO habilidades (nome, icone_url, cor_background, ordem_exibicao) VALUES (?, ?, ?, ?)';
    db.query(sql, [nome, icone_url, cor_background, ordem_exibicao], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, nome });
    });
});

// READ todas as habilidades
app.get('/habilidades', (req, res) => {
    db.query('SELECT * FROM habilidades', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// READ habilidade por ID
app.get('/habilidades/:id', (req, res) => {
    db.query('SELECT * FROM habilidades WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// UPDATE habilidade
app.put('/habilidades/:id', (req, res) => {
    const { nome, icone_url, cor_background, ordem_exibicao } = req.body;
    const sql = 'UPDATE habilidades SET nome = ?, icone_url = ?, cor_background = ?, ordem_exibicao = ? WHERE id = ?';
    db.query(sql, [nome, icone_url, cor_background, ordem_exibicao, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Habilidade atualizada com sucesso' });
    });
});

// DELETE habilidade
app.delete('/habilidades/:id', (req, res) => {
    db.query('DELETE FROM habilidades WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Habilidade excluída com sucesso' });
    });
});

// ===== CRUD CERTIFICADOS =====

// CREATE certificado
app.post('/certificados', (req, res) => {
    const { titulo, descricao, imagem_url, documento_url, data_obtencao, ordem_exibicao } = req.body;
    const sql = 'INSERT INTO certificados (titulo, descricao, imagem_url, documento_url, data_obtencao, ordem_exibicao) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [titulo, descricao, imagem_url, documento_url, data_obtencao, ordem_exibicao], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, titulo });
    });
});

// READ todos os certificados
app.get('/certificados', (req, res) => {
    db.query('SELECT * FROM certificados', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// READ certificado por ID
app.get('/certificados/:id', (req, res) => {
    db.query('SELECT * FROM certificados WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// UPDATE certificado
app.put('/certificados/:id', (req, res) => {
    const { titulo, descricao, imagem_url, documento_url, data_obtencao, ordem_exibicao } = req.body;
    const sql = 'UPDATE certificados SET titulo = ?, descricao = ?, imagem_url = ?, documento_url = ?, data_obtencao = ?, ordem_exibicao = ? WHERE id = ?';
    db.query(sql, [titulo, descricao, imagem_url, documento_url, data_obtencao, ordem_exibicao, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Certificado atualizado com sucesso' });
    });
});

// DELETE certificado
app.delete('/certificados/:id', (req, res) => {
    db.query('DELETE FROM certificados WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Certificado excluído com sucesso' });
    });
});

// ===== CRUD CONTATOS =====

// CREATE contato
app.post('/contatos', (req, res) => {
    const { tipo, valor, icone_url, ordem_exibicao } = req.body;
    const sql = 'INSERT INTO contatos (tipo, valor, icone_url, ordem_exibicao) VALUES (?, ?, ?, ?)';
    db.query(sql, [tipo, valor, icone_url, ordem_exibicao], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, tipo, valor });
    });
});

// READ todos os contatos
app.get('/contatos', (req, res) => {
    db.query('SELECT * FROM contatos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// READ contato por ID
app.get('/contatos/:id', (req, res) => {
    db.query('SELECT * FROM contatos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// UPDATE contato
app.put('/contatos/:id', (req, res) => {
    const { tipo, valor, icone_url, ordem_exibicao } = req.body;
    const sql = 'UPDATE contatos SET tipo = ?, valor = ?, icone_url = ?, ordem_exibicao = ? WHERE id = ?';
    db.query(sql, [tipo, valor, icone_url, ordem_exibicao, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Contato atualizado com sucesso' });
    });
});

// DELETE contato
app.delete('/contatos/:id', (req, res) => {
    db.query('DELETE FROM contatos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Contato excluído com sucesso' });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em: http://localhost:3000');
});
