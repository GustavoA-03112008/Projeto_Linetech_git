SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;




SELECT *
FROM __EFMigrationsHistory
ORDER BY MigrationId;




SELECT
    fk.name AS NomeRelacionamento,
    OBJECT_NAME(fk.parent_object_id) AS TabelaOrigem,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS ColunaOrigem,
    OBJECT_NAME(fk.referenced_object_id) AS TabelaDestino,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS ColunaDestino
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc
    ON fk.object_id = fkc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) = 'SalaRecursos';








EXEC sp_help 'dbo.Recursos';
EXEC sp_help 'dbo.SalaRecursos';




SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME IN (
    'Salas',
    'Usuarios',
    'Recursos',
    'SalaRecursos',
    'Reservas',
    'Atividades',
    'SolicitacoesAcesso'
)
ORDER BY TABLE_NAME, ORDINAL_POSITION;




SELECT
    fk.name AS ChaveEstrangeira,
    OBJECT_NAME(fk.parent_object_id) AS TabelaOrigem,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS ColunaOrigem,
    OBJECT_NAME(fk.referenced_object_id) AS TabelaDestino,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS ColunaDestino
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc
    ON fk.object_id = fkc.constraint_object_id
ORDER BY TabelaOrigem;











SELECT
    t.name AS Tabela,
    i.name AS Indice,
    i.is_primary_key AS ChavePrimaria,
    i.is_unique AS IndiceUnico
FROM sys.indexes i
INNER JOIN sys.tables t
    ON i.object_id = t.object_id
WHERE i.name IS NOT NULL
  AND i.name <> ' '
ORDER BY t.name, i.name;






EXEC sp_helpindex 'dbo.Reservas';



SELECT
    TABLE_NAME AS Tabela,
    COLUMN_NAME AS Coluna,
    DATA_TYPE AS Tipo,
    CHARACTER_MAXIMUM_LENGTH AS Tamanho
FROM INFORMATION_SCHEMA.COLUMNS
ORDER BY TABLE_NAME, ORDINAL_POSITION;




SELECT
    'Recursos' AS Tabela,
    COUNT(*) AS Quantidade
FROM Recursos

UNION ALL

SELECT 'SalaRecursos', COUNT(*) FROM SalaRecursos

UNION ALL

SELECT 'Reservas', COUNT(*) FROM Reservas

UNION ALL

SELECT 'Atividades', COUNT(*) FROM Atividades

UNION ALL

SELECT 'SolicitacoesAcesso', COUNT(*) FROM SolicitacoesAcesso;



SELECT COUNT(*) AS QuantidadeUsuarios
FROM Usuarios;


SELECT
    t.name AS Tabela,
    c.name AS Coluna,
    c.is_nullable AS PermiteNulo,
    c.is_identity AS Identidade,
    dc.definition AS ValorPadrao
FROM sys.tables t
INNER JOIN sys.columns c
    ON t.object_id = c.object_id
LEFT JOIN sys.default_constraints dc
    ON c.default_object_id = dc.object_id
WHERE t.name IN (
    'Salas',
    'Usuarios',
    'Recursos',
    'SalaRecursos',
    'Reservas',
    'Atividades',
    'SolicitacoesAcesso'
)
ORDER BY t.name, c.column_id;








SELECT
    t.name AS Tabela,
    i.name AS Indice,
    i.is_unique AS Unico,
    STRING_AGG(c.name, ', ') AS Colunas
FROM sys.indexes i
INNER JOIN sys.tables t
    ON i.object_id = t.object_id
INNER JOIN sys.index_columns ic
    ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
INNER JOIN sys.columns c
    ON ic.object_id = c.object_id
    AND ic.column_id = c.column_id
WHERE i.is_primary_key = 0
  AND i.is_unique_constraint = 0
  AND i.name IS NOT NULL
GROUP BY t.name, i.name, i.is_unique
ORDER BY t.name, i.name;







SELECT
    fk.name AS ChaveEstrangeira,
    OBJECT_NAME(fk.parent_object_id) AS Tabela,
    fk.delete_referential_action_desc AS AoExcluir
FROM sys.foreign_keys fk
ORDER BY Tabela, ChaveEstrangeira;




SELECT
    t.name AS Tabela,
    kc.name AS ChavePrimaria
FROM sys.key_constraints kc
INNER JOIN sys.tables t
    ON kc.parent_object_id = t.object_id
WHERE kc.type = 'PK'
ORDER BY t.name;












SELECT
    t.name AS Tabela,
    i.name AS Indice,
    STRING_AGG(c.name, ', ') AS Colunas
FROM sys.indexes i
INNER JOIN sys.tables t
    ON i.object_id = t.object_id
INNER JOIN sys.index_columns ic
    ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
INNER JOIN sys.columns c
    ON ic.object_id = c.object_id
    AND ic.column_id = c.column_id
WHERE i.is_primary_key = 0
  AND i.is_unique_constraint = 0
  AND i.name IS NOT NULL
  AND i.name IN (
      'IX_Atividades_ReservaId',
      'IX_Reservas_UsuarioId',
      'IX_SalaRecursos_RecursoId',
      'IX_SolicitacoesAcesso_GestorId',
      'IX_SolicitacoesAcesso_UsuarioId'
  )
GROUP BY t.name, i.name
ORDER BY t.name, i.name;






EXEC sp_helpindex 'dbo.Salas';
EXEC sp_helpindex 'dbo.SalaRecursos';










SELECT
    OBJECT_NAME(i.object_id) AS Tabela,
    i.name AS Indice,
    c.name AS Coluna
FROM sys.indexes i
INNER JOIN sys.index_columns ic
    ON i.object_id = ic.object_id
    AND i.index_id = ic.index_id
INNER JOIN sys.columns c
    ON ic.object_id = c.object_id
    AND ic.column_id = c.column_id
WHERE i.is_primary_key = 0
  AND i.is_unique_constraint = 0
  AND i.name IS NOT NULL
  AND OBJECT_NAME(i.object_id) IN (
      'Atividades',
      'Reservas',
      'SalaRecursos',
      'SolicitacoesAcesso'
  )
ORDER BY Tabela, Indice, ic.key_ordinal;




















EXEC sp_helpindex 'dbo.Recursos';
EXEC sp_helpindex 'dbo.Usuarios';
EXEC sp_helpindex 'dbo.Reservas';
EXEC sp_helpindex 'dbo.Atividades';
EXEC sp_helpindex 'dbo.SolicitacoesAcesso';