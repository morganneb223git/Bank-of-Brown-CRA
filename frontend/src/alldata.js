import React, { useState, useEffect, useMemo } from 'react';
import { Container, Card } from 'react-bootstrap';
import { useTable, useFilters, useGlobalFilter } from 'react-table';

function AllData() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch all accounts from API
        fetch('/account/all')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setData(data || []); // Ensure data is an array or set it to an empty array
            });
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: 'Account Number',
                accessor: 'accountNumber',
            },
            {
                Header: 'Account Type',
                accessor: 'accountType',
            },
            {
                Header: 'Balance',
                accessor: 'balance',
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
        },
        useFilters,
        useGlobalFilter
    );

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header>
                    <h5>All Data in Store:</h5>
                </Card.Header>
                <Card.Body>
                    <div>
                        <input
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Search..."
                        />
                    </div>
                    <table {...getTableProps()} className="table">
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => {
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AllData;
