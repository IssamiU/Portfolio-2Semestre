const express = require('express')
const app = express()

app.set('view engine', 'ejs')

app.get('/',(req, res) =>{
    res.render('index',{tituloPagina: 'Portfólio de Issami Umeoka'})
})

app.use(express.static('public'));

app.listen(3000,() => {
    console.log('Servidor rodando em: http://localhost:3000')
})

