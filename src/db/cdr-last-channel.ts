import { ConfigService } from '@src/config/config.service';
import type { LastAnsweredChannelRow } from '@src/util/types';
import mysql from 'mysql2/promise';

export const getLastAnsweredChannel = async (phone: string): Promise<string | null> => {
  const config = new ConfigService();
  const mysqlUrl = config.get('MYSQL_DATABASE_URL');

  const connection = await mysql.createConnection(mysqlUrl);

  try {
    const [rows] = await connection.execute<LastAnsweredChannelRow[]>(
      `
      SELECT
        SUBSTRING_INDEX(t.channel, '-', 1) AS channel_short
      FROM
        cdr t
      WHERE
          calldate > NOW() - INTERVAL 1 HOUR
        AND disposition = 'ANSWERED'
        AND dst LIKE ?
      ORDER BY
        calldate DESC
      LIMIT 1
      `,
      [`%${phone}%`],
    );

    return rows.length > 0 ? rows[0].channel_short : null;
  } finally {
    await connection.end();
  }
};
