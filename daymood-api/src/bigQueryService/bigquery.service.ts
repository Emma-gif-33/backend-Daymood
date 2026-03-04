import { BigQuery } from '@google-cloud/bigquery';
import { prisma } from '../../prisma/prisma.client';

const bigquery = new BigQuery({
    keyFilename: 'service-account.json',
    projectId: 'data-from-software'
});

export async function insertSnapshot() {
    const stats = await prisma.$queryRaw<any[]>`
        SELECT
            5 AS project_id,
            CURRENT_DATE AS snapshot_date,
            queryid::text AS queryid,
            dbid,
            userid,
            query,
            calls,
            total_exec_time AS total_exec_time_ms,
            mean_exec_time AS mean_exec_time_ms,
            min_exec_time AS min_exec_time_ms,
            max_exec_time AS max_exec_time_ms,
            stddev_exec_time AS stddev_exec_time_ms,
            rows AS rows_returned,
            shared_blks_hit,
            shared_blks_read,
            shared_blks_dirtied,
            shared_blks_written,
            temp_blks_read,
            temp_blks_written
        FROM pg_stat_statements
        ORDER BY total_exec_time DESC
        LIMIT 100
    `;

    if (!stats || stats.length === 0) {
        console.log('No hay estadísticas para enviar');
        return;
    }

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

    const dataset = bigquery.dataset('benchmarking_warehouse');
    const table = dataset.table('daily_query_metrics');

    await table.insert(rows);
    console.log(`Snapshot enviado a BigQuery: ${rows.length} filas`);
}

// Mantener insertTestRow para no romper el controller existente
export async function insertTestRow() {
    return insertSnapshot();
}