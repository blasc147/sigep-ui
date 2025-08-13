-- Query para generar archivo Sirge desde SQL Server Management Studio
-- Cambia el valor de @mes según necesites (formato: YYYYMM)
DECLARE @mes VARCHAR(6) = '202507'; -- Cambia aquí el mes que necesites
DECLARE @fechadesde DATETIME, @fechahasta DATETIME;

-- Calcular fechas basadas en @mes (compatible con SQL Server 2008)
SET @fechadesde = CAST(LEFT(@mes, 4) + '-' + RIGHT(@mes, 2) + '-01' AS DATETIME);
SET @fechahasta = DATEADD(DAY, -1, DATEADD(MONTH, 1, @fechadesde));

-- Mostrar las fechas para verificación
SELECT @fechadesde AS FechaDesde, @fechahasta AS FechaHasta;

-- Limpiar tabla temporal
DELETE FROM ExpedientesSirgeTemporal;

-- Poblar tabla temporal con totales por expediente
INSERT INTO ExpedientesSirgeTemporal 
SELECT se.NumeroExpediente, SUM(sf.Total)
FROM spsFacturas sf 
     INNER JOIN spsExpedientes se 
       ON se.NumeroExpediente = sf.NumeroExpediente
WHERE se.Recibido BETWEEN @fechadesde AND @fechahasta
GROUP BY se.NumeroExpediente;

-- 1. Prestaciones de facturas con fecha de recibido en expediente
SELECT 
  sp.idPractica,
  CASE 
    WHEN (sad.idDiag IS NULL AND sam.IdSnomed IS NULL) THEN sp.Codigo
    WHEN sam.IdSnomed IS NOT NULL THEN LEFT(sp.Codigo, 6) + sam.IdSnomed
    ELSE LEFT(sp.Codigo, 6) + sad.idDiag
  END AS Codigo,
  sp.cuie,
  CONVERT(char(10), sp.FechaPrestacion, 126) AS fecha_prestacion,
  vb.Apellido, vb.Nombre, vb.ClaveBeneficiario, vb.Tipodoc, vb.Clasedoc, vb.DNI, vb.Sexo,
  CONVERT(char(10), vb.FechaNac, 126) AS fecha_nacimiento,
  sp.Precio AS valor_unitario_facturado, 1 AS Cantidad_facturada, sp.Precio AS importe_prestacion_facturado,
  sf.NumeroFactura + sf.cuie AS Id_factura, sf.NumeroFactura, CONVERT(char(10), sf.Fecha, 126) AS fecha_factura, sf.total,
  CONVERT(char(10), se.Recibido, 126) AS fecha_recepcion_factura,
  'N' AS Alta_complejidad,
  se.NroDisposicion AS Id_liquidacion,
  CONVERT(char(10), se.Liquidado, 126) AS fecha_liquidacion,
  sp.Precio AS valor_unitario_aprobado, 1 AS Cantidad_aprobada, sp.Precio AS Importe_Prestacion_Aprobado,
  '' AS Nro_comprobante_extracto_bancario,
  vrd.id_1, vrd.valor_1, vrd.id_2, vrd.valor_2, vrd.id_3, vrd.valor_3, vrd.id_4, vrd.valor_4, vrd.id_5, vrd.valor_5,
  se.NroOrdenPago AS id_op,
  se.NroOrdenPago, CONVERT(char(10), se.Debito, 126) AS fecha_op,
  '' AS importe_total_op,
  se.NumeroExpediente, CONVERT(char(10), se.Debito, 126) AS fecha_debito_bancario,
  '' AS importe_debito_bancario,
  CONVERT(char(10), se.Notificacion, 126) AS fecha_notificacion
FROM spsPracticas sp
     INNER JOIN spsFacturas sf 
       ON sf.NumeroFactura = sp.NumeroFactura 
      AND sf.cuie = sp.cuie
     INNER JOIN spsExpedientes se 
       ON se.NumeroExpediente = sf.NumeroExpediente
     INNER JOIN T_Beneficiarios vb 
       ON vb.ClaveBeneficiario = sp.ClaveBeneficiario 
      AND vb.Periodo = sp.Periodo
     LEFT JOIN T_ReportablesDOI3 vrd 
       ON vrd.idPractica = sp.idPractica
     LEFT JOIN spsAnexaDiagnostico sad 
       ON sad.idPractica = sp.idPractica
     LEFT JOIN spsAnexaMedicamento sam 
       ON sam.idPractica = sp.idPractica
WHERE se.Recibido BETWEEN @fechadesde AND @fechahasta

UNION

-- Comunidad paso 1
SELECT 
  sp.idPractica, sp.Codigo, sp.cuie, CONVERT(char(10), sp.FechaPrestacion, 126) AS fecha_prestacion,
  '' AS Apellido, '' AS Nombre, '9999999999999999' AS ClaveBeneficiario, 'COM' AS Tipodoc, 'C' AS Clasedoc, '' AS DNI, '' AS Sexo,
  '' AS fecha_nacimiento,
  sp.Precio AS valor_unitario_facturado, 1 AS Cantidad_facturada, sp.Precio AS importe_prestacion_facturado,
  sf.NumeroFactura + sf.cuie AS Id_factura, sf.NumeroFactura, CONVERT(char(10), sf.Fecha, 126) AS fecha_factura, sf.total,
  CONVERT(char(10), se.Recibido, 126) AS fecha_recepcion_factura,
  'N' AS Alta_complejidad,
  se.NroDisposicion AS Id_liquidacion,
  CONVERT(char(10), se.Liquidado, 126) AS fecha_liquidacion,
  sp.Precio AS valor_unitario_aprobado, 1 AS Cantidad_aprobada, sp.Precio AS Importe_Prestacion_Aprobado,
  '' AS Nro_comprobante_extracto_bancario,
  '' AS id_1, '' AS valor_1, '' AS id_2, '' AS valor_2, '' AS id_3, '' AS valor_3, '' AS id_4, '' AS valor_4, '' AS id_5, '' AS valor_5,
  se.NroOrdenPago AS id_op,
  se.NroOrdenPago, CONVERT(char(10), se.Debito, 126) AS fecha_op,
  '' AS importe_total_op,
  se.NumeroExpediente, CONVERT(char(10), se.Debito, 126) AS fecha_debito_bancario,
  '' AS importe_debito_bancario,
  CONVERT(char(10), se.Notificacion, 126) AS fecha_notificacion
FROM spsPracticas sp
     INNER JOIN spsFacturas sf 
       ON sf.NumeroFactura = sp.NumeroFactura 
      AND sf.cuie = sp.cuie
     INNER JOIN spsExpedientes se 
       ON se.NumeroExpediente = sf.NumeroExpediente
WHERE sp.idCat = 0 
  AND se.Recibido BETWEEN @fechadesde AND @fechahasta

UNION

-- 2. Prestaciones con fecha de liquidado en el mes
SELECT 
  sp.idPractica,
  CASE 
    WHEN (sad.idDiag IS NULL AND sam.IdSnomed IS NULL) THEN sp.Codigo
    WHEN sam.IdSnomed IS NOT NULL THEN LEFT(sp.Codigo, 6) + sam.IdSnomed
    ELSE LEFT(sp.Codigo, 6) + sad.idDiag
  END AS Codigo,
  sp.cuie,
  CONVERT(char(10), sp.FechaPrestacion, 126) AS fecha_prestacion,
  vb.Apellido, vb.Nombre, vb.ClaveBeneficiario, vb.Tipodoc, vb.Clasedoc, vb.DNI, vb.Sexo,
  CONVERT(char(10), vb.FechaNac, 126) AS fecha_nacimiento,
  sp.Precio AS valor_unitario_facturado, 1 AS Cantidad_facturada, sp.Precio AS importe_prestacion_facturado,
  sf.NumeroFactura + sf.cuie AS Id_factura, sf.NumeroFactura, CONVERT(char(10), sf.Fecha, 126) AS fecha_factura, sf.total,
  CONVERT(char(10), se.Recibido, 126) AS fecha_recepcion_factura,
  'N' AS Alta_complejidad,
  se.NroDisposicion AS Id_liquidacion,
  CONVERT(char(10), se.Liquidado, 126) AS fecha_liquidacion,
  sp.Precio AS valor_unitario_aprobado, 1 AS Cantidad_aprobada, sp.Precio AS Importe_Prestacion_Aprobado,
  '' AS Nro_comprobante_extracto_bancario,
  vrd.id_1, vrd.valor_1, vrd.id_2, vrd.valor_2, vrd.id_3, vrd.valor_3, vrd.id_4, vrd.valor_4, vrd.id_5, vrd.valor_5,
  se.NroOrdenPago AS id_op,
  se.NroOrdenPago, CONVERT(char(10), se.Debito, 126) AS fecha_op,
  e.Total AS importe_total_op,
  se.NumeroExpediente, CONVERT(char(10), se.Debito, 126) AS fecha_debito_bancario,
  '' AS importe_debito_bancario,
  CONVERT(char(10), se.Notificacion, 126) AS fecha_notificacion
FROM spsPracticas sp
     INNER JOIN spsFacturas sf 
       ON sf.NumeroFactura = sp.NumeroFactura 
      AND sf.cuie = sp.cuie
     INNER JOIN spsExpedientes se 
       ON se.NumeroExpediente = sf.NumeroExpediente
     INNER JOIN T_Beneficiarios vb 
       ON vb.ClaveBeneficiario = sp.ClaveBeneficiario 
      AND vb.Periodo = sp.Periodo
     INNER JOIN ExpedientesSirgeTemporal e 
       ON se.NumeroExpediente = e.NumeroExpediente
     LEFT JOIN T_ReportablesDOI3 vrd 
       ON vrd.idPractica = sp.idPractica
     LEFT JOIN spsAnexaDiagnostico sad 
       ON sad.idPractica = sp.idPractica
     LEFT JOIN spsAnexaMedicamento sam 
       ON sam.idPractica = sp.idPractica
WHERE se.Liquidado BETWEEN @fechadesde AND @fechahasta

UNION

-- Comunidad paso 2
SELECT 
  sp.idPractica, sp.Codigo, sp.cuie, CONVERT(char(10), sp.FechaPrestacion, 126) AS fecha_prestacion,
  '' AS Apellido, '' AS Nombre, '9999999999999999' AS ClaveBeneficiario, 'COM' AS Tipodoc, 'C' AS Clasedoc, '' AS DNI, '' AS Sexo,
  '' AS fecha_nacimiento,
  sp.Precio AS valor_unitario_facturado, 1 AS Cantidad_facturada, sp.Precio AS importe_prestacion_facturado,
  sf.NumeroFactura + sf.cuie AS Id_factura, sf.NumeroFactura, CONVERT(char(10), sf.Fecha, 126) AS fecha_factura, sf.total,
  CONVERT(char(10), se.Recibido, 126) AS fecha_recepcion_factura,
  'N' AS Alta_complejidad,
  se.NroDisposicion AS Id_liquidacion,
  CONVERT(char(10), se.Liquidado, 126) AS fecha_liquidacion,
  sp.Precio AS valor_unitario_aprobado, 1 AS Cantidad_aprobada, sp.Precio AS Importe_Prestacion_Aprobado,
  '' AS Nro_comprobante_extracto_bancario,
  '' AS id_1, '' AS valor_1, '' AS id_2, '' AS valor_2, '' AS id_3, '' AS valor_3, '' AS id_4, '' AS valor_4, '' AS id_5, '' AS valor_5,
  se.NroOrdenPago AS id_op,
  se.NroOrdenPago, CONVERT(char(10), se.Debito, 126) AS fecha_op,
  e.Total AS importe_total_op,
  se.NumeroExpediente, CONVERT(char(10), se.Debito, 126) AS fecha_debito_bancario,
  '' AS importe_debito_bancario,
  CONVERT(char(10), se.Notificacion, 126) AS fecha_notificacion
FROM spsPracticas sp
     INNER JOIN spsFacturas sf 
       ON sf.NumeroFactura = sp.NumeroFactura 
      AND sf.cuie = sp.cuie
     INNER JOIN spsExpedientes se 
       ON se.NumeroExpediente = sf.NumeroExpediente
     INNER JOIN ExpedientesSirgeTemporal e 
       ON se.NumeroExpediente = e.NumeroExpediente
WHERE sp.idCat = 0 
  AND se.Liquidado BETWEEN @fechadesde AND @fechahasta

UNION

-- 3. Prestaciones con fecha de débito en el mes
SELECT 
  sp.idPractica,
  CASE 
    WHEN (sad.idDiag IS NULL AND sam.IdSnomed IS NULL) THEN sp.Codigo
    WHEN sam.IdSnomed IS NOT NULL THEN LEFT(sp.Codigo, 6) + sam.IdSnomed
    ELSE LEFT(sp.Codigo, 6) + sad.idDiag
  END AS Codigo,
  sp.cuie,
  CONVERT(char(10), sp.FechaPrestacion, 126) AS fecha_prestacion,
  vb.Apellido, vb.Nombre, vb.ClaveBeneficiario, vb.Tipodoc, vb.Clasedoc, vb.DNI, vb.Sexo,
  CONVERT(char(10), vb.FechaNac, 126) AS fecha_nacimiento,
  sp.Precio AS valor_unitario_facturado, 1 AS Cantidad_facturada, sp.Precio AS importe_prestacion_facturado,
  sf.NumeroFactura + sf.cuie AS Id_factura, sf.NumeroFactura, CONVERT(char(10), sf.Fecha, 126) AS fecha_factura, sf.total,
  CONVERT(char(10), se.Recibido, 126) AS fecha_recepcion_factura,
  'N' AS Alta_complejidad,
  se.NroDisposicion AS Id_liquidacion,
  CONVERT(char(10), se.Liquidado, 126) AS fecha_liquidacion,
  sp.Precio AS valor_unitario_aprobado, 1 AS Cantidad_aprobada, sp.Precio AS Importe_Prestacion_Aprobado,
  '' AS Nro_comprobante_extracto_bancario,
  vrd.id_1, vrd.valor_1, vrd.id_2, vrd.valor_2, vrd.id_3, vrd.valor_3, vrd.id_4, vrd.valor_4, vrd.id_5, vrd.valor_5,
  se.NroOrdenPago AS id_op,
  se.NroOrdenPago, CONVERT(char(10), se.Debito, 126) AS fecha_op,
  e.Total AS importe_total_op,
  se.NumeroExpediente, CONVERT(char(10), se.Debito, 126) AS fecha_debito_bancario,
  e.Total AS importe_debito_bancario,
  CONVERT(char(10), se.Notificacion, 126) AS fecha_notificacion
FROM spsPracticas sp
     INNER JOIN spsFacturas sf 
       ON sf.NumeroFactura = sp.NumeroFactura 
      AND sf.cuie = sp.cuie
     INNER JOIN spsExpedientes se 
       ON se.NumeroExpediente = sf.NumeroExpediente
     INNER JOIN T_Beneficiarios vb 
       ON vb.ClaveBeneficiario = sp.ClaveBeneficiario 
      AND vb.Periodo = sp.Periodo
     INNER JOIN ExpedientesSirgeTemporal e 
       ON se.NumeroExpediente = e.NumeroExpediente
     LEFT JOIN T_ReportablesDOI3 vrd 
       ON vrd.idPractica = sp.idPractica
     LEFT JOIN spsAnexaDiagnostico sad 
       ON sad.idPractica = sp.idPractica
     LEFT JOIN spsAnexaMedicamento sam 
       ON sam.idPractica = sp.idPractica
WHERE se.Debito BETWEEN @fechadesde AND @fechahasta;
