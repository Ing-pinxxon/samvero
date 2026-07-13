# Inicia la instancia portable de MySQL usada por SAMVERO.
# Uso: click derecho > "Ejecutar con PowerShell", o desde una terminal:
#   powershell -ExecutionPolicy Bypass -File scripts\start-mysql.ps1
#
# Deja esta ventana abierta mientras uses la tienda. Ciérrala para apagar MySQL.

$base = "C:\Users\Daniel\mysql-portable\mysql-8.0.40-winx64"
$data = "C:\Users\Daniel\mysql-portable\data"

if (-not (Test-Path "$base\bin\mysqld.exe")) {
  Write-Host "No se encontró MySQL en $base" -ForegroundColor Red
  exit 1
}

Write-Host "Iniciando MySQL (puerto 3306)... Deja esta ventana abierta." -ForegroundColor Green
& "$base\bin\mysqld.exe" --datadir="$data" --basedir="$base" --port=3306 --console
