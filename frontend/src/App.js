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

const API_URLS = {
  TRANSACTIONS: '/api/transactions',
  USERS: '/api/users'
};

function App() {
  // State management
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    accountNumber: '',
    amount: '',
    type: '',
    date: '',
    userEmail: ''
  });
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');

  // Data fetching
  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, []);

  // New effect to handle automatic email population
  useEffect(() => {
    if (users.length > 0) {
      // Auto-populate with first user's email or the only user's email
      setNewTransaction(prev => ({
        ...prev,
        userEmail: users[0].email
      }));
    }
  }, [users]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(API_URLS.TRANSACTIONS);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      setError(`Error fetching transactions: ${error.message}`);
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URLS.USERS);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(`Error fetching users: ${error.message}`);
      console.error('Error fetching users:', error);
    }
  };

  // Form handlers
  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  // API operations
  const createTransaction = async () => {
    try {
      const response = await fetch(API_URLS.TRANSACTIONS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });
      
      if (!response.ok) throw new Error('Failed to create transaction');
      
      setNewTransaction(prev => ({
        accountNumber: '',
        amount: '',
        type: '',
        date: '',
        userEmail: users[0]?.email || '' // Maintain the auto-populated email
      }));
      fetchTransactions();
    } catch (error) {
      setError('Error creating transaction');
      console.error('Error creating transaction:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch(API_URLS.USERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      
      if (!response.ok) throw new Error('Failed to create user');
      
      setNewUser({
        username: '',
        password: '',
        email: ''
      });
      fetchUsers();
    } catch (error) {
      setError('Error creating user');
      console.error('Error creating user:', error);
    }
  };

  // Component rendering
  const renderTransactionForm = () => (
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
          <FormControl fullWidth>
            <InputLabel>User Email</InputLabel>
            <Select
              name="userEmail"
              value={newTransaction.userEmail}
              onChange={handleTransactionChange}
              label="User Email"
              disabled={users.length === 1} // Disable if only one user
            >
              {users.map((user) => (
                <MenuItem key={user.id || user.email} value={user.email}>
                  {user.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
  );

  const renderUserForm = () => (
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
  );

  const renderTransactionsList = () => (
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
          {transactions.map((transaction, index) => (
            <Paper
              key={transaction.id || index}
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
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">{transaction.date}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {transaction.userEmail}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderUsersList = () => (
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
          {users.map((user, index) => (
            <Paper
              key={user.id || index}
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
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#1a237e' }}>
            StreamlinePay
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              {renderTransactionForm()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderUserForm()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderTransactionsList()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderUsersList()}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;