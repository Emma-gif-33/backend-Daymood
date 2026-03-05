import { BigQuery } from '@google-cloud/bigquery';
import { prisma } from '../../prisma/prisma.client';
import * as fs from 'fs';
import * as path from 'path';

const bigquery = new BigQuery({
    keyFilename: 'service-account.json',
    projectId: 'data-from-software'
});

export async function dailyCutoff() {
    
    const stats = await prisma.$queryRaw<any[]>`
        SELECT * FROM export_daily_query_metrics
    `;
    //en casode que el pg_stat_satements no este activo
    if (!stats || stats.length === 0) {
        throw new Error('No hay métricas para exportar. Verifica que pg_stat_statements esté activo y calls > 0');
    }

    // 2. Formatear filas para BigQuery
    const rows = stats.map(s => ({
        project_id: 5,
        snapshot_date: new Date().toISOString().split('T')[0],
        queryid: String(s.queryid ?? ''),
        dbid: Number(s.dbid ?? 0),
        userid: Number(s.userid ?? 0),
        query: (s.query ?? '').substring(0, 500),
        calls: Number(s.calls ?? 0),
        total_exec_time_ms: parseFloat(s.total_exec_time_ms ?? 0),
        mean_exec_time_ms: parseFloat(s.mean_exec_time_ms ?? 0),
        min_exec_time_ms: parseFloat(s.min_exec_time_ms ?? 0),
        max_exec_time_ms: parseFloat(s.max_exec_time_ms ?? 0),
        stddev_exec_time_ms: s.stddev_exec_time_ms ? parseFloat(s.stddev_exec_time_ms) : null,
        rows_returned: Number(s.rows_returned ?? 0),
        shared_blks_hit: Number(s.shared_blks_hit ?? 0),
        shared_blks_read: Number(s.shared_blks_read ?? 0),
        shared_blks_dirtied: Number(s.shared_blks_dirtied ?? 0),
        shared_blks_written: Number(s.shared_blks_written ?? 0),
        temp_blks_read: Number(s.temp_blks_read ?? 0),
        temp_blks_written: Number(s.temp_blks_written ?? 0)
    }));

    //csv de respaldo
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const csvFileName = `project_5_${today}.csv`;
    const csvPath = path.join(process.cwd(), 'snapshots', csvFileName);

    //carpeta si no existe
    if (!fs.existsSync(path.join(process.cwd(), 'snapshots'))) {
        fs.mkdirSync(path.join(process.cwd(), 'snapshots'));
    }

    const headers = Object.keys(rows[0]).join(',');
    const csvRows = rows.map(r => Object.values(r).join(','));
    fs.writeFileSync(csvPath, [headers, ...csvRows].join('\n'), 'utf-8');
    console.log(`📄 CSV generado: ${csvFileName}`);

    
    const dataset = bigquery.dataset('benchmarking_warehouse');
    const table = dataset.table('daily_query_metrics');

    await table.insert(rows);
    console.log(`${rows.length} filas enviadas a BigQuery`);

    
    await prisma.$executeRaw`SELECT pg_stat_statements_reset()`;
    console.log('pg_stat_statements reseteado');

    return {
        rowsSent: rows.length,
        csvFile: csvFileName
    };
}


export async function insertSnapshot() {
    return dailyCutoff();
}

export async function insertTestRow() {
    return dailyCutoff();
}