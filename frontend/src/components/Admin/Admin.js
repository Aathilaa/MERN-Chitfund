import React, { useState, useEffect } from 'react';
import { Card, Container, Typography, Box } from '@mui/material';
import axios from 'axios'; // Import axios

const Admin = () => {
    const [totalReceived, setTotalReceived] = useState(0);
    const [todayEarnings, setTodayEarnings] = useState(0);
    const [todayPaid, setTodayPaid] = useState(0);
    const [members21L, setMembers21L] = useState(0);
    const [members50k, setMembers50k] = useState(0);
    const [membersJoinedLast7Days, setMembersJoinedLast7Days] = useState(0);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch total received amount
            const totalReceivedRes = await axios.get('http://localhost:5000/api/payments/total-received');
            setTotalReceived(totalReceivedRes.data.total);

            // Fetch today's earnings
            const todayEarningsRes = await axios.get('http://localhost:5000/api/payments/today-earnings');
            setTodayEarnings(todayEarningsRes.data.total);

            // Fetch today's paid amount
            const todayPaidRes = await axios.get('http://localhost:5000/api/payments/today-paid'); // Assuming you have this route
            setTodayPaid(todayPaidRes.data.total);

            // Fetch number of members in '21 month..1L'
            const members21LRes = await axios.get('http://localhost:5000/api/users/count-plan/21 month..1L');
            setMembers21L(members21LRes.data.count);

            // Fetch number of members in '21 month..50k'
            const members50kRes = await axios.get('http://localhost:5000/api/users/count-plan/21 month..50k');
            setMembers50k(members50kRes.data.count);

            // Fetch number of members joined in the last 7 days
            const recentMembersRes = await axios.get('http://localhost:5000/api/users/joined-last-week');
            setMembersJoinedLast7Days(recentMembersRes.data.count);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    return (
        <Container style={{ marginTop: '70px' }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
                <Card sx={{ padding: 2, width: '300px' }}>
                    <Typography variant="h6">Total Received Amount</Typography>
                    <Typography variant="h4" color="primary">
                        ₹{totalReceived.toLocaleString()}
                    </Typography>
                </Card>
                <Card sx={{ padding: 2, width: '300px' }}>
                    <Typography variant="h6">Today's Earnings</Typography>
                    <Typography variant="h4" color="primary">
                        ₹{todayEarnings.toLocaleString()}
                    </Typography>
                </Card>
                <Card sx={{ padding: 2, width: '300px' }}>
                    <Typography variant="h6">Today's Paid Amount</Typography>
                    <Typography variant="h4" color="primary">
                        ₹{todayPaid.toLocaleString()}
                    </Typography>
                </Card>
                <Card sx={{ padding: 2, width: '300px' }}>
                    <Typography variant="h6">Members in '21 month..1L'</Typography>
                    <Typography variant="h4" color="secondary">
                        {members21L}
                    </Typography>
                </Card>
                <Card sx={{ padding: 2, width: '300px' }}>
                    <Typography variant="h6">Members in '21 month..50k'</Typography>
                    <Typography variant="h4" color="secondary">
                        {members50k}
                    </Typography>
                </Card>
                <Card sx={{ padding: 2, width: '300px' }}>
                    <Typography variant="h6">Members Joined in Last 7 Days</Typography>
                    <Typography variant="h4" color="secondary">
                        {membersJoinedLast7Days}
                    </Typography>
                </Card>
            </Box>
        </Container>
    );
};

export default Admin;





