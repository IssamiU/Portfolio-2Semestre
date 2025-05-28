const express = require('express');
const mysql = require('mysql2');

const app = express();


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1836224481',
    database: 'portfolio'  
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

app.get('/', (req, res) => {  
    const sql = 'SELECT * FROM projetos WHERE ativo = TRUE ORDER BY ordem_exibicao ASC';
    
    db.query(sql, (err, projetos) => {
        if (err) {
            console.error('Erro ao buscar projetos:', err);
            return res.render('index', {
                tituloPagina: 'Portfólio de Issami Umeoka',
                projetos: []
            });
        }
        
        console.log('Homepage carregada com', projetos.length, 'projetos');
        res.render('index', {
            tituloPagina: 'Portfólio de Issami Umeoka',
            projetos: projetos
        });
    });
});

// create
app.post('/projetos', (req, res) => {
    const { titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao } = req.body;
    const sql = 'INSERT INTO projetos (titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, titulo, descricao });
    });
});

// read todos
app.get('/projetos', (req, res) => {
    db.query('SELECT * FROM projetos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// read id
app.get('/projetos/:id', (req, res) => {
    db.query('SELECT * FROM projetos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// update
app.put('/projetos/:id', (req, res) => {
    const { titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao } = req.body;
    const sql = 'UPDATE projetos SET titulo = ?, descricao = ?, tecnologias = ?, atuacao = ?, github_url = ?, imagem_url = ?, video_url = ?, tipo_midia = ?, semestre = ?, ordem_exibicao = ? WHERE id = ?';
    db.query(sql, [titulo, descricao, tecnologias, atuacao, github_url, imagem_url, video_url, tipo_midia, semestre, ordem_exibicao, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Projeto atualizado com sucesso' });
    });
});

// delete
app.delete('/projetos/:id', (req, res) => {
    db.query('DELETE FROM projetos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ mensagem: 'Projeto excluído com sucesso' });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em: http://localhost:3000');
});
