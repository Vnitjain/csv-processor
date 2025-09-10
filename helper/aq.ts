import * as aq from "arquero";
import type { Table } from "arquero";

/** Type of the optional second argument to aq.fromCSV() */
export type FromCsvOptions = Parameters<typeof aq.fromCSV>[1];

/**
 * Parse a CSV string into an Arquero Table.
 * autoType is enabled by default for convenient numbers/dates parsing.
 */
export function parseCsvToTable(
    csv: string,
    options?: FromCsvOptions
): Table {
    return aq.fromCSV(csv, { autoType: true, ...options });
}

/**
 * Parse a CSV string straight into an array of objects (via Arquero).
 */
export function parseCsvToObjects<T = Record<string, unknown>>(
    csv: string,
    options?: FromCsvOptions
): T[] {
    return parseCsvToTable(csv, options).objects() as T[];
}