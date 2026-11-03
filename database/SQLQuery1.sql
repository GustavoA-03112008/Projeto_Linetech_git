
/*
    LINETECH - BANCO DE DADOS
    Script consolidado
*/

-- ==========================================
-- 1. CRIAR O BANCO DE DADOS
-- ==========================================

IF DB_ID(N'LinetechDB') IS NULL
    CREATE DATABASE LinetechDB;
GO

USE LinetechDB;
GO

-- ==========================================
-- 2. TABELA USUARIOS
-- ==========================================

IF OBJECT_ID('dbo.Usuarios', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Usuarios
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nome NVARCHAR(120) NOT NULL,
        Email NVARCHAR(180) NOT NULL,
        SenhaHash NVARCHAR(255) NOT NULL,
        Ativo BIT NOT NULL DEFAULT 1,
        DataCriacao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        Perfil NVARCHAR(30) NOT NULL DEFAULT N'Professor'
    );
END;
GO

IF COL_LENGTH('dbo.Usuarios', 'Perfil') IS NULL
BEGIN
    ALTER TABLE dbo.Usuarios
    ADD Perfil NVARCHAR(30) NOT NULL
        CONSTRAINT DF_Usuarios_Perfil
        DEFAULT N'Professor';
END;
GO

-- ==========================================
-- 3. TABELA SALAS
-- ==========================================

IF OBJECT_ID('dbo.Salas', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Salas
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nome NVARCHAR(120) NOT NULL,
        Capacidade INT NOT NULL,
        Disponivel BIT NOT NULL DEFAULT 1,

        CONSTRAINT CK_Salas_Capacidade
            CHECK (Capacidade > 0)
    );
END;
GO

-- ==========================================
-- 4. TABELA RECURSOS
-- ==========================================

IF OBJECT_ID('dbo.Recursos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Recursos
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nome NVARCHAR(120) NOT NULL,
        Descricao NVARCHAR(500) NULL
    );
END;
GO

-- ==========================================
-- 5. TABELA SALA RECURSOS
-- ==========================================

IF OBJECT_ID('dbo.SalaRecursos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.SalaRecursos
    (
        SalaId INT NOT NULL,
        RecursoId INT NOT NULL,

        CONSTRAINT PK_SalaRecursos
            PRIMARY KEY (SalaId, RecursoId),

        CONSTRAINT FK_SalaRecursos_Salas
            FOREIGN KEY (SalaId)
            REFERENCES dbo.Salas(Id),

        CONSTRAINT FK_SalaRecursos_Recursos
            FOREIGN KEY (RecursoId)
            REFERENCES dbo.Recursos(Id)
    );
END;
GO

-- ==========================================
-- 6. TABELA RESERVAS
-- ==========================================

IF OBJECT_ID('dbo.Reservas', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Reservas
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UsuarioId INT NOT NULL,
        SalaId INT NOT NULL,
        DataInicio DATETIME2 NOT NULL,
        DataFim DATETIME2 NOT NULL,
        Finalidade NVARCHAR(250) NULL,

        Status NVARCHAR(20) NOT NULL
            DEFAULT N'Pendente',

        DataCriacao DATETIME2 NOT NULL
            DEFAULT SYSDATETIME(),

        CONSTRAINT FK_Reservas_Usuarios
            FOREIGN KEY (UsuarioId)
            REFERENCES dbo.Usuarios(Id),

        CONSTRAINT FK_Reservas_Salas
            FOREIGN KEY (SalaId)
            REFERENCES dbo.Salas(Id),

        CONSTRAINT CK_Reservas_Periodo
            CHECK (DataFim > DataInicio),

        CONSTRAINT CK_Reservas_Status
            CHECK (
                Status IN (
                    N'Pendente',
                    N'Confirmada',
                    N'Cancelada',
                    N'Concluida'
                )
            )
    );
END;
GO

-- ==========================================
-- 7. TABELA ATIVIDADES
-- ==========================================

IF OBJECT_ID('dbo.Atividades', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Atividades
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ReservaId INT NOT NULL,
        Nome NVARCHAR(150) NOT NULL,
        Descricao NVARCHAR(500) NULL,
        DataInicio DATETIME2 NULL,
        DataFim DATETIME2 NULL,

        CONSTRAINT FK_Atividades_Reservas
            FOREIGN KEY (ReservaId)
            REFERENCES dbo.Reservas(Id),

        CONSTRAINT CK_Atividades_Periodo
            CHECK (
                DataInicio IS NULL
                OR DataFim IS NULL
                OR DataFim > DataInicio
            )
    );
END;
GO

-- ==========================================
-- 8. TABELA SOLICITACOES DE ACESSO
-- ==========================================

IF OBJECT_ID('dbo.SolicitacoesAcesso', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.SolicitacoesAcesso
    (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UsuarioId INT NOT NULL,
        Funcao NVARCHAR(50) NOT NULL,

        Status NVARCHAR(20) NOT NULL
            DEFAULT N'Pendente',

        DataSolicitacao DATETIME2 NOT NULL
            DEFAULT SYSDATETIME(),

        GestorId INT NULL,
        DataDecisao DATETIME2 NULL,
        Observacao NVARCHAR(500) NULL,

        CONSTRAINT FK_SolicitacoesAcesso_Usuario
            FOREIGN KEY (UsuarioId)
            REFERENCES dbo.Usuarios(Id),

        CONSTRAINT FK_SolicitacoesAcesso_Gestor
            FOREIGN KEY (GestorId)
            REFERENCES dbo.Usuarios(Id),

        CONSTRAINT CK_SolicitacoesAcesso_Funcao
            CHECK (
                Funcao IN (
                    N'ReservarSalas',
                    N'GerenciarRecursos'
                )
            ),

        CONSTRAINT CK_SolicitacoesAcesso_Status
            CHECK (
                Status IN (
                    N'Pendente',
                    N'Aprovada',
                    N'Recusada'
                )
            )
    );
END;
GO

-- ==========================================
-- 9. CRIAR INDICES
-- ==========================================

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.Usuarios')
      AND name = 'UX_Usuarios_Email'
)
AND NOT EXISTS (
    SELECT Email FROM dbo.Usuarios
    GROUP BY Email
    HAVING COUNT(*) > 1
)
BEGIN
    CREATE UNIQUE INDEX UX_Usuarios_Email
        ON dbo.Usuarios(Email);
END;
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.Reservas')
      AND name = 'IX_Reservas_Sala_Periodo'
)
BEGIN
    CREATE INDEX IX_Reservas_Sala_Periodo
        ON dbo.Reservas(SalaId, DataInicio, DataFim);
END;
GO

-- ==========================================
-- 10. CADASTRAR RECURSOS PADRÃO
-- ==========================================

IF NOT EXISTS (
    SELECT 1 FROM dbo.Recursos
    WHERE Nome = N'Projetor'
)
    INSERT INTO dbo.Recursos (Nome, Descricao)
    VALUES (N'Projetor', N'Equipamento para apresentações');

IF NOT EXISTS (
    SELECT 1 FROM dbo.Recursos
    WHERE Nome = N'Computadores'
)
    INSERT INTO dbo.Recursos (Nome, Descricao)
    VALUES (N'Computadores', N'Computadores para atividades');

IF NOT EXISTS (
    SELECT 1 FROM dbo.Recursos
    WHERE Nome = N'Internet'
)
    INSERT INTO dbo.Recursos (Nome, Descricao)
    VALUES (N'Internet', N'Acesso à rede');

IF NOT EXISTS (
    SELECT 1 FROM dbo.Recursos
    WHERE Nome = N'Quadro branco'
)
    INSERT INTO dbo.Recursos (Nome, Descricao)
    VALUES (N'Quadro branco', N'Quadro para escrita');

IF NOT EXISTS (
    SELECT 1 FROM dbo.Recursos
    WHERE Nome = N'Ar-condicionado'
)
    INSERT INTO dbo.Recursos (Nome, Descricao)
    VALUES (N'Ar-condicionado', N'Climatização da sala');
GO

-- ==========================================
-- 11. CONFERIR AS TABELAS
-- ==========================================

SELECT
    TABLE_NAME AS Tabela
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo'
  AND TABLE_NAME IN (
      'Usuarios',
      'Salas',
      'Recursos',
      'SalaRecursos',
      'Reservas',
      'Atividades',
      'SolicitacoesAcesso'
  )
ORDER BY TABLE_NAME;
GO

-- ==========================================
-- 12. CONFERIR OS USUARIOS
-- ==========================================

SELECT
    Id,
    Nome,
    Email,
    Perfil,
    Ativo
FROM dbo.Usuarios
ORDER BY Id;
GO

-- ==========================================
-- 13. CONFERIR OS RECURSOS
-- ==========================================

SELECT *
FROM dbo.Recursos
ORDER BY Nome;
GO

-- ==========================================
-- 14. CONFERIR O BANCO ATUAL
-- ==========================================

SELECT DB_NAME() AS BancoAtual;
GO
