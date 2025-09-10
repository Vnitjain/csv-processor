// CsvDataTable.tsx
import React, { useMemo, useState } from "react";
import { ScrollView, Text, useWindowDimensions, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import { parseCsvToObjects } from "../helper/aq";

type Row = Record<string, unknown>;

const COL_MIN_WIDTH = 120;   // tweak as you like
const ROW_HEIGHT = 44;       // tweak as you like
const MAX_COLS_TO_FIT = 4;   // how many columns we try to fit before horizontal scroll kicks in

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

    // --- Equal column width logic ---
    const { width: screenWidth } = useWindowDimensions();
    const colWidth = useMemo(() => {
        if (columns.length === 0) return COL_MIN_WIDTH;
        // Try to fit up to MAX_COLS_TO_FIT columns on screen; beyond that, horizontal scroll
        const colsToFit = Math.min(columns.length, MAX_COLS_TO_FIT);
        const available = Math.max(screenWidth - 24, COL_MIN_WIDTH * colsToFit); // small padding fudge
        return Math.max(COL_MIN_WIDTH, Math.floor(available / colsToFit));
    }, [columns.length, screenWidth]);

    const cellStyle = useMemo(() => [{ width: colWidth, justifyContent: "center" }], [colWidth]);
    const rowStyle = useMemo(() => [{ height: ROW_HEIGHT }], []);

    return (
        <ScrollView horizontal>
            <DataTable>
                <DataTable.Header>
                    {columns.map((col) => (
                        <DataTable.Title
                            key={col}
                            style={cellStyle}
                            sortDirection={sortCol === col ? (asc ? "ascending" : "descending") : undefined}
                            onPress={() => {
                                if (sortCol === col) setAsc(!asc);
                                else {
                                    setSortCol(col);
                                    setAsc(true);
                                }
                            }}
                        >
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerText}>
                                {col}
                            </Text>
                        </DataTable.Title>
                    ))}
                </DataTable.Header>

                {sortedRows.slice(from, to).map((row, i) => (
                    <DataTable.Row key={`r-${from + i}`} style={rowStyle}>
                        {columns.map((col) => (
                            <DataTable.Cell key={`${col}-${from + i}`} style={cellStyle}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cellText}>
                                    {String((row as any)[col] ?? "")}
                                </Text>
                            </DataTable.Cell>
                        ))}
                    </DataTable.Row>
                ))}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.max(1, Math.ceil(sortedRows.length / rowsPerPage))}
                    onPageChange={setPage}
                    label={`${sortedRows.length ? from + 1 : 0}-${to} of ${sortedRows.length}`}
                    numberOfItemsPerPage={rowsPerPage}
                    showFastPaginationControls
                />
            </DataTable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    headerText: {
        fontWeight: "600",
    },
    cellText: {
        // Keep rows a uniform height by preventing wrapping
    },
});
