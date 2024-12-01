import React , { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './ChitAccordion.css';
import axios from 'axios';

const ChitAccordion = () => {
    const [dueUsers, setDueUsers] = useState([]);
    useEffect(() => {
        const fetchDueUsers = async () => {
          try {
            const response = await axios.get('http://localhost:5000/api/add-user/due-next-week');
            setDueUsers(response.data);
          } catch (error) {
            console.error('Error fetching due users:', error);
          }
        };
    
        fetchDueUsers();
      }, []);
    return (
        <div className="custom-text">
            {/* Accordion 1: Due in next 7 days */}
            <Accordion  >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} className="custom-accordion-summary">
                    <Typography >Due in Next 7 Days</Typography>
                </AccordionSummary>
                <AccordionDetails className="custom-accordion-details">
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>S.No</TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Total Amount to Pay</TableCell>
                                    <TableCell>Remaining Amount</TableCell>
                                    <TableCell>Mobile Number</TableCell>
                                    <TableCell>Pay</TableCell>
                                    <TableCell>Prized/Non-Prized</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {dueUsers.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.customId}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.totalAmountToPay}</TableCell>
                  <TableCell>{user.remainingAmount}</TableCell>
                  <TableCell>{user.mobileNum}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary">
                      Pay
                    </Button>
                  </TableCell>
                  <TableCell>{user.prized ? 'Prized' : 'Non-Prized'}</TableCell>
                </TableRow>
              ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>

            {/* Accordion 2: Old Due */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Old Due</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer component={Paper}>
                        <Table>
                        <TableHead>
                                <TableRow>
                                    <TableCell>S.No</TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Total Amount to Pay</TableCell>
                                    <TableCell>Remaining Amount</TableCell>
                                    <TableCell>Mobile Number</TableCell>
                                    <TableCell>Pay</TableCell>
                                    <TableCell>Prized/Non-Prized</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* {data.map((row) => (
                                    <TableRow key={row.sNo}>
                                        <TableCell>{row.sNo}</TableCell>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.totalAmount}</TableCell>
                                        <TableCell>{row.remainingAmount}</TableCell>
                                        <TableCell>{row.mobileNumber}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary">
                                                Pay
                                            </Button>
                                        </TableCell>
                                        <TableCell>{row.prized ? 'Prized' : 'Non-Prized'}</TableCell>
                                    </TableRow>
                                ))} */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>

            {/* Accordion 3: Amount to Give this Month */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Amount to Give this Month</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer component={Paper}>
                        <Table>
                        <TableHead>
                                <TableRow>
                                    <TableCell>S.No</TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Total Amount to Pay</TableCell>
                                    <TableCell>Remaining Amount</TableCell>
                                    <TableCell>Mobile Number</TableCell>
                                    <TableCell>Pay</TableCell>
                                    <TableCell>Prized/Non-Prized</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* {data.map((row) => (
                                    <TableRow key={row.sNo}>
                                        <TableCell>{row.sNo}</TableCell>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.totalAmount}</TableCell>
                                        <TableCell>{row.remainingAmount}</TableCell>
                                        <TableCell>{row.mobileNumber}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary">
                                                Pay
                                            </Button>
                                        </TableCell>
                                        <TableCell>{row.prized ? 'Prized' : 'Non-Prized'}</TableCell>
                                    </TableRow>
                                ))} */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default ChitAccordion;
