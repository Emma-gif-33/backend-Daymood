import { BigQuery } from '@google-cloud/bigquery';
import { OAuth2Client } from 'google-auth-library';

export async function insertSnapshot(accessToken: string) {
  const authClient = new OAuth2Client();
  authClient.setCredentials({ access_token: accessToken });

  const bigquery = new BigQuery({
    projectId: 'data-from-software',
    authClient
  });

  const rows = [
    {
      project_id: 1,
      snapshot_date: '2026-02-24',
      calls: 50,
      mean_exec_time_ms: 30.2
    }
  ];

  const dataset = bigquery.dataset('benchmarking_warehouse');
  const table = dataset.table('daily_query_metrics');

  await table.insert(rows);
}