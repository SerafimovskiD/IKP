$ErrorActionPreference = 'Stop'

$scriptDir     = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir    = Split-Path -Parent $scriptDir
$propsPath     = Join-Path $backendDir 'src\main\resources\application.properties'
$backupDir     = Join-Path $backendDir 'backup'
$pgDump        = Join-Path $scriptDir 'pg17-bin\pg_dump.exe'
$keepCount     = 5
$logPath       = Join-Path $backupDir 'backup.log'

function Write-Log($message) {
    $line = "[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $message
    Write-Host $line
    Add-Content -Path $logPath -Value $line
}

New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

try {
    $propsRaw = Get-Content -Raw -Path $propsPath

    $urlMatch = [regex]::Match($propsRaw, 'spring\.datasource\.url\s*=\s*jdbc:postgresql://([^:/]+):(\d+)/([^?\s]+)\?(.+)')
    if (-not $urlMatch.Success) {
        throw "Could not parse spring.datasource.url from application.properties"
    }
    $dbHost  = $urlMatch.Groups[1].Value
    $dbPort  = $urlMatch.Groups[2].Value
    $dbName  = $urlMatch.Groups[3].Value
    $query   = $urlMatch.Groups[4].Value

    $userMatch = [regex]::Match($query, 'user=([^&\s]+)')
    $passMatch = [regex]::Match($query, 'password=([^&\s]+)')
    if (-not $userMatch.Success -or -not $passMatch.Success) {
        throw "Could not find user/password params in spring.datasource.url"
    }
    $dbUser = $userMatch.Groups[1].Value
    $dbPass = $passMatch.Groups[1].Value

    $timestamp = Get-Date -Format 'yyyy-MM-dd'
    $outFile   = Join-Path $backupDir "ikp-mvr_$timestamp.backup"

    Write-Log "Starting backup of '$dbName' @ '${dbHost}:${dbPort}' -> $outFile"

    $env:PGPASSWORD = $dbPass
    & $pgDump `
        --host=$dbHost --port=$dbPort --username=$dbUser --dbname=$dbName `
        --no-owner --no-privileges --format=custom `
        --file=$outFile
    $exitCode = $LASTEXITCODE
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue

    if ($exitCode -ne 0 -or -not (Test-Path $outFile) -or (Get-Item $outFile).Length -eq 0) {
        if (Test-Path $outFile) { Remove-Item $outFile -Force }
        throw "pg_dump failed (exit code $exitCode)"
    }

    $sizeKb = [Math]::Round((Get-Item $outFile).Length / 1KB, 1)
    Write-Log "Backup OK ($sizeKb KB)."

    $allBackups = Get-ChildItem -Path $backupDir -Filter 'ikp-mvr_*.backup' |
        Sort-Object LastWriteTime -Descending
    if ($allBackups.Count -gt $keepCount) {
        $toDelete = $allBackups | Select-Object -Skip $keepCount
        foreach ($f in $toDelete) {
            Remove-Item $f.FullName -Force
            Write-Log "Deleted old backup: $($f.Name)"
        }
    }

    Write-Log "Done - keeping the last $keepCount backups."
}
catch {
    Write-Log "ERROR: $($_.Exception.Message)"
    exit 1
}
