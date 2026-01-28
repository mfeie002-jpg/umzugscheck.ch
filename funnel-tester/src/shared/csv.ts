const escapeCsv = (value: string): string => {
  if (value.includes('"')) value = value.replace(/"/g, '""');
  if (/[",\n]/.test(value)) return `"${value}"`;
  return value;
};

export const toCsv = (rows: Array<Record<string, string | number | boolean | null | undefined>>): string => {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(
      headers
        .map((key) => {
          const raw = row[key];
          if (raw === null || raw === undefined) return '';
          return escapeCsv(String(raw));
        })
        .join(',')
    );
  }
  return lines.join('\n');
};
