
USE LinetechDB;
GO

SELECT
    TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'dbo'
  AND TABLE_NAME IN ('Salas', 'Recursos', 'SalaRecursos');






  
USE LinetechDB;
GO

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
