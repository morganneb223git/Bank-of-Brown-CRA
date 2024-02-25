///All Data Component ./frontend/src/alldata.js
import React from 'react';
import { Container, Card } from 'react-bootstrap';

function AllData() {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        // Fetch all accounts from API
        fetch('/account/all')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setData(data); // Store the data directly without stringifying
            });
    }, []);

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header>
                    <h5>All Data in Store:</h5>
                </Card.Header>
                <Card.Body>
                    {/* Check if data is not null and then map over it if it's an array */}
                    {data ? (
                        <pre>{JSON.stringify(data, null, 2)}</pre> // Beautify the JSON display
                    ) : (
                        <p>Loading data...</p> // Show a loading message if data is null
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AllData;