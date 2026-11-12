USE LinetechDB;
GO

SELECT name
FROM sys.tables
WHERE name IN (
    'Usuarios',
    'Salas',
    'Recursos',
    'SalaRecursos',
    'Reservas',
    'Atividades',
    'SolicitacoesAcesso'
);




USE LinetechDB;
GO

SELECT Id, Nome, Email, Perfil, Ativo
FROM dbo.Usuarios
WHERE Id = 6;



USE LinetechDB;
GO

UPDATE dbo.Usuarios
SET Perfil = 'Gestor'
WHERE Id = 6;
GO





SELECT Id, Nome, Email, Perfil
FROM dbo.Usuarios
WHERE Id = 6;



USE LinetechDB;
GO

SELECT Id, Nome, Email, Perfil, Ativo
FROM dbo.Usuarios
WHERE Perfil = 'Professor'
  AND Ativo = 1;


SELECT Id, UsuarioId, Funcao, Status
FROM dbo.SolicitacoesAcesso
WHERE Id = 5;



SELECT *
FROM Reservas
WHERE UsuarioId = 6;



SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Reservas'
ORDER BY ORDINAL_POSITION;

SELECT *
FROM Reservas
WHERE UsuarioId = 6;





SELECT Id, UsuarioId, SalaId, DataInicio, DataFim,
       Finalidade, Status, DataCriacao
FROM dbo.Reservas
WHERE UsuarioId = 6;


SELECT *
FROM dbo.Salas;


SELECT Id, Nome, Email, Ativo
FROM dbo.Usuarios
WHERE Id = 6;