USE LinetechDB;
GO

-- ==========================================
-- 1. CRIAR A TABELA USUARIOS
-- ==========================================
IF OBJECT_ID('dbo.Usuarios', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Usuarios (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nome NVARCHAR(120) NOT NULL,
        Email NVARCHAR(180) NOT NULL,
        SenhaHash NVARCHAR(255) NOT NULL,
        Ativo BIT NOT NULL DEFAULT 1,
        DataCriacao DATETIME2 NOT NULL
            DEFAULT SYSDATETIME()
    );
END;
GO

-- ==========================================
-- 2. CRIAR A TABELA RECURSOS
-- ==========================================
IF OBJECT_ID('dbo.Recursos', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Recursos (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nome NVARCHAR(120) NOT NULL,
        Descricao NVARCHAR(500) NULL
    );
END;
GO

-- ==========================================
-- 3. CRIAR A TABELA RESERVAS
-- ==========================================
IF OBJECT_ID('dbo.Reservas', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Reservas (
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
-- 4. CRIAR A TABELA ATIVIDADES
-- ==========================================
IF OBJECT_ID('dbo.Atividades', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Atividades (
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
-- 5. CADASTRAR OS RECURSOS
-- ==========================================

IF NOT EXISTS (
    SELECT 1 FROM dbo.Recursos
    WHERE Nome = N'Projetor'
)
BEGIN
    INSERT INTO dbo.Recursos (Nome, Descricao)
    VALUES (
        N'Projetor',
        N'Equipamento para apresentações'
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.Recursos
    WHERE Nome = N'Computadores'
)
BEGIN
    INSERT INTO dbo.Recursos (Nome, Descricao)
    VALUES (
        N'Computadores',
        N'Computadores para atividades'
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.Recursos
    WHERE Nome = N'Internet'
)
BEGIN
    INSERT INTO dbo.Recursos (Nome, Descricao)
    VALUES (
        N'Internet',
        N'Acesso à rede'
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.Recursos
    WHERE Nome = N'Quadro branco'
)
BEGIN
    INSERT INTO dbo.Recursos (Nome, Descricao)
    VALUES (
        N'Quadro branco',
        N'Quadro para escrita'
    );
END;

IF NOT EXISTS (
    SELECT 1 FROM dbo.Recursos
    WHERE Nome = N'Ar-condicionado'
)
BEGIN
    INSERT INTO dbo.Recursos (Nome, Descricao)
    VALUES (
        N'Ar-condicionado',
        N'Climatização da sala'
    );
END;
GO

-- ==========================================
-- 6. CONFERIR AS TABELAS
-- ==========================================
SELECT
    TABLE_SCHEMA AS Esquema,
    TABLE_NAME AS Tabela
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo'
  AND TABLE_NAME IN (
      'Salas',
      'Recursos',
      'Usuarios',
      'Reservas',
      'Atividades'
  )
ORDER BY TABLE_NAME;
GO

-- ==========================================
-- 7. CONFERIR OS RECURSOS
-- ==========================================
SELECT *
FROM dbo.Recursos
ORDER BY Nome;
GO

-- ==========================================
-- 8. CONFERIR OS INDICES EXISTENTES
-- ==========================================
SELECT
    t.name AS Tabela,
    i.name AS Indice
FROM sys.indexes AS i
INNER JOIN sys.tables AS t
    ON i.object_id = t.object_id
WHERE i.name IN (
    'UX_Usuarios_Email',
    'IX_Reservas_Sala_Periodo'
)
ORDER BY t.name;
GO

-- ==========================================
-- 9. CONFERIR O BANCO ATUAL
-- ==========================================
SELECT DB_NAME() AS BancoAtual;
GO