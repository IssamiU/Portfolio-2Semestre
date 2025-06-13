drop database portfolio;
create database portfolio;
use portfolio;

-- Tabela para informações pessoais
CREATE TABLE perfil (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ano_nascimento INT,
    curso_atual VARCHAR(200),
    instituicao VARCHAR(200),
    previsao_conclusao INT,
    formacao_anterior VARCHAR(200),
    instituicao_anterior VARCHAR(200),
    ano_conclusao_anterior INT,
    biografia TEXT,
    objetivo_profissional TEXT,
    caracteristicas_pessoais TEXT,
    foto_url VARCHAR(500),
    curriculo_url VARCHAR(500),
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela para habilidades/tecnologias
CREATE TABLE habilidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    icone_url VARCHAR(500),
    cor_background VARCHAR(50),
    ordem_exibicao INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para projetos
CREATE TABLE projetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    tecnologias TEXT,
    atuacao TEXT,
    github_url VARCHAR(500),
    imagem_url VARCHAR(500),
    video_url VARCHAR(500),
    tipo_midia ENUM('imagem', 'video') DEFAULT 'imagem',
    semestre VARCHAR(50),
    ordem_exibicao INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela para certificados
CREATE TABLE certificados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    imagem_url VARCHAR(500),
    documento_url VARCHAR(500),
    data_obtencao DATE,
    ordem_exibicao INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para contatos/redes sociais
CREATE TABLE contatos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('email', 'linkedin', 'github', 'telefone', 'outro') NOT NULL,
    valor VARCHAR(500) NOT NULL,
    icone_url VARCHAR(500),
    ordem_exibicao INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);