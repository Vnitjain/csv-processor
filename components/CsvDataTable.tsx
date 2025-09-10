
// CsvDataTable.tsx
import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { DataTable } from "react-native-paper";
import { parseCsvToObjects } from "../helper/aq"; // from your helpers

type Row = Record<string, unknown>;

export function CsvDataTable({
    csv,
    rowsPerPage = 10,
}: {
    csv: string;
    rowsPerPage?: number;
}) {
    const rows = useMemo<Row[]>(() => parseCsvToObjects<Row>(csv), [csv]);
    const columns = useMemo(() => (rows[0] ? Object.keys(rows[0]) : []), [rows]);

    const [page, setPage] = useState(0);
    const [sortCol, setSortCol] = useState<string | null>(null);
    const [asc, setAsc] = useState(true);

    const sortedRows = useMemo(() => {
        if (!sortCol) return rows;
        return [...rows].sort((a, b) => {
            const av = a[sortCol as keyof Row];
            const bv = b[sortCol as keyof Row];
            if (av == null && bv == null) return 0;
            if (av == null) return asc ? 1 : -1;
            if (bv == null) return asc ? -1 : 1;
            return String(av).localeCompare(String(bv), undefined, { numeric: true }) * (asc ? 1 : -1);
        });
    }, [rows, sortCol, asc]);

    const from = page * rowsPerPage;
    const to = Math.min((page + 1) * rowsPerPage, sortedRows.length);

    return (
        <ScrollView horizontal>
            <DataTable>
                <DataTable.Header>
                    {columns.map((col) => (
                        <DataTable.Title
                            key={col}
                            sortDirection={sortCol === col ? (asc ? "ascending" : "descending") : undefined}
                            onPress={() => {
                                if (sortCol === col) setAsc(!asc);
                                else {
                                    setSortCol(col);
                                    setAsc(true);
                                }
                            }}
                        >
                            {col}
                        </DataTable.Title>
                    ))}
                </DataTable.Header>

                {sortedRows.slice(from, to).map((row, i) => (
                    <DataTable.Row key={i}>
                        {columns.map((col) => (
                            <DataTable.Cell key={col}>{String((row as any)[col] ?? "")}</DataTable.Cell>
                        ))}
                    </DataTable.Row>
                ))}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(sortedRows.length / rowsPerPage)}
                    onPageChange={setPage}
                    label={`${from + 1}-${to} of ${sortedRows.length}`}
                    numberOfItemsPerPage={rowsPerPage}
                    showFastPaginationControls
                />
            </DataTable>
        </ScrollView>
    );
}
