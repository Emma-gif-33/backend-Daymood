import { BigQuery } from '@google-cloud/bigquery';
import path from 'path';

const bigquery = new BigQuery({
  keyFilename: 'service-account.json',
  projectId: 'data-from-software'
});

export async function insertTestRow() {
  const dataset = bigquery.dataset('benchmarking_warehouse');
  const table = dataset.table('daily_query_metrics');

  const rows = [
    {
      project_id: 1,
      snapshot_date: new Date().toISOString().split('T')[0],
      calls: 10,
      mean_exec_time_ms: 25
    }
  ];

  await table.insert(rows);
}