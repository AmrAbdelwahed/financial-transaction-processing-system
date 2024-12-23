import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  AddCircleOutline,
  AccountBalanceWallet,
  Person,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#2e7d32',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 20px',
        },
      },
    },
  },
});

function App() {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTransaction, setNewTransaction] = useState({ accountNumber: '', amount: '', type: '', date: '' });
  const [newUser, setNewUser] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      setError('Error fetching transactions');
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError('Error fetching users');
      console.error('Error fetching users:', error);
    }
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const createTransaction = async () => {
    try {
      const response = await fetch('http://localhost:8085/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });
      
      if (!response.ok) throw new Error('Failed to create transaction');
      
      setNewTransaction({ accountNumber: '', amount: '', type: '', date: '' });
      fetchTransactions();
    } catch (error) {
      setError('Error creating transaction');
      console.error('Error creating transaction:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      if (!response.ok) throw new Error('Failed to create user');
      
      setNewUser({ username: '', password: '', email: '' });
      fetchUsers();
    } catch (error) {
      setError('Error creating user');
      console.error('Error creating user:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#1a237e' }}>
            Financial Transaction System
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Main Content */}
          <Grid container spacing={4}>
            {/* Transaction Form */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalanceWallet color="primary" />
                      <Typography variant="h6">Create Transaction</Typography>
                    </Box>
                  }
                />
                <CardContent>
                  <Box component="form" sx={{ '& > :not(style)': { mb: 2 } }}>
                    <TextField
                      fullWidth
                      label="Account Number"
                      name="accountNumber"
                      value={newTransaction.accountNumber}
                      onChange={handleTransactionChange}
                    />
                    <TextField
                      fullWidth
                      label="Amount"
                      name="amount"
                      type="number"
                      value={newTransaction.amount}
                      onChange={handleTransactionChange}
                    />
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        name="type"
                        value={newTransaction.type}
                        onChange={handleTransactionChange}
                        label="Type"
                      >
                        <MenuItem value="">Select Type</MenuItem>
                        <MenuItem value="DEBIT">DEBIT</MenuItem>
                        <MenuItem value="CREDIT">CREDIT</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Date"
                      name="date"
                      type="date"
                      value={newTransaction.date}
                      onChange={handleTransactionChange}
                      InputLabelProps={{ shrink: true }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={createTransaction}
                      startIcon={<AddCircleOutline />}
                      size="large"
                    >
                      Create Transaction
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* User Form */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person color="secondary" />
                      <Typography variant="h6">Create User</Typography>
                    </Box>
                  }
                />
                <CardContent>
                  <Box component="form" sx={{ '& > :not(style)': { mb: 2 } }}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={newUser.username}
                      onChange={handleUserChange}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={newUser.password}
                      onChange={handleUserChange}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={newUser.email}
                      onChange={handleUserChange}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={createUser}
                      startIcon={<AddCircleOutline />}
                      size="large"
                    >
                      Create User
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Transactions List */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalanceWallet color="primary" />
                      <Typography variant="h6">Recent Transactions</Typography>
                    </Box>
                  }
                />
                <CardContent>
                  <List>
                    {transactions.map((transaction) => (
                      <Paper
                        key={transaction.id}
                        elevation={1}
                        sx={{ mb: 1, bgcolor: '#fafafa', borderRadius: 2 }}
                      >
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1">
                                  {transaction.accountNumber}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {transaction.type === 'CREDIT' ? (
                                    <ArrowUpward sx={{ color: 'success.main' }} />
                                  ) : (
                                    <ArrowDownward sx={{ color: 'error.main' }} />
                                  )}
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      color: transaction.type === 'CREDIT' ? 'success.main' : 'error.main',
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    ${transaction.amount}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            secondary={transaction.date}
                          />
                        </ListItem>
                      </Paper>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Users List */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person color="secondary" />
                      <Typography variant="h6">Registered Users</Typography>
                    </Box>
                  }
                />
                <CardContent>
                  <List>
                    {users.map((user) => (
                      <Paper
                        key={user.id}
                        elevation={1}
                        sx={{ mb: 1, bgcolor: '#fafafa', borderRadius: 2 }}
                      >
                        <ListItem>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                {user.username}
                              </Typography>
                            }
                            secondary={user.email}
                          />
                        </ListItem>
                      </Paper>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;