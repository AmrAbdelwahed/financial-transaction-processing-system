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
  // Form validation state
  const [formErrors, setFormErrors] = useState({
    accountNumber: '',
    amount: '',
    type: '',
    userEmail: ''
  });

  const [newTransaction, setNewTransaction] = useState({
    accountNumber: '',
    amount: '',
    type: '',
    date: new Date().toISOString().split('T')[0], // Set current date by default
    userEmail: ''
  });
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: ''
  });

  const [userFormErrors, setUserFormErrors] = useState({
    username: '',
    password: '',
    email: '',
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
  const validateTransactionForm = () => {
    const errors = {
      accountNumber: '',
      amount: '',
      type: '',
      userEmail: ''
    };
    let isValid = true;

    // Account number validation
    if (!newTransaction.accountNumber.trim()) {
      errors.accountNumber = 'Account number is required';
      isValid = false;
    }else if (!/^\d{8}$/.test(newTransaction.accountNumber)) {
      // Regular expression to check for exactly 8 digits
      errors.accountNumber = 'Account number must be an 8-digit number';
      isValid = false;
    }

    // Amount validation
    if (!newTransaction.amount) {
      errors.amount = 'Amount is required';
      isValid = false;
    } else if (isNaN(newTransaction.amount) || parseFloat(newTransaction.amount) <= 0) {
      errors.amount = 'Amount must be a positive number';
      isValid = false;
    }

    // Type validation
    if (!newTransaction.type) {
      errors.type = 'Transaction type is required';
      isValid = false;
    }

    // Email validation
    if (!newTransaction.userEmail) {
      errors.userEmail = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(newTransaction.userEmail)) {
      errors.userEmail = 'Please enter a valid email';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validateUserForm = () => {
    const errors = {};
    let isValid = true;

    if (!newUser.username) {
      errors.username = 'Username is required.';
      isValid = false;
    }
    if (!newUser.password || newUser.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }
    if (!newUser.email || !/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = 'A valid email is required.';
      isValid = false;
    }

    setUserFormErrors(errors);
    return isValid;
  };

  const createTransaction = async () => {
    if (!validateTransactionForm ()) {
      setError('Please fix the form errors before submitting');
      return;
    }

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
        date: new Date().toISOString().split('T')[0], // Reset with current date
        userEmail: users[0]?.email || '' // Maintain the auto-populated email
      }));
      setFormErrors({
        accountNumber: '',
        amount: '',
        type: '',
        userEmail: ''
      });
      fetchTransactions();
    } catch (error) {
      setError('Error creating transaction');
      console.error('Error creating transaction:', error);
    }
  };

  const createUser = async () => {
    if (!validateUserForm ()) {
      setError('Please fix the form errors before submitting');
      return;
    }
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
            required
            label="Account Number"
            name="accountNumber"
            value={newTransaction.accountNumber}
            onChange={handleTransactionChange}
            error={!!formErrors.accountNumber}
            helperText={formErrors.accountNumber}
          />
          <TextField
            fullWidth
            required
            label="Amount"
            name="amount"
            type="number"
            value={newTransaction.amount}
            onChange={handleTransactionChange}
            error={!!formErrors.amount}
            helperText={formErrors.amount}
          />
          <FormControl fullWidth required error={!!formErrors.type}>
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
            {formErrors.type && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                {formErrors.type}
              </Typography>
            )}
          </FormControl>
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={newTransaction.date}
            disabled  // Disable date field as it's automatically set
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth required error={!!formErrors.userEmail}>
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
            {formErrors.userEmail && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                {formErrors.userEmail}
              </Typography>
            )}
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
            required
            label="Username"
            name="username"
            value={newUser.username}
            onChange={handleUserChange}
            error={!!userFormErrors.username}
            helperText={userFormErrors.username}
          />
          <TextField
            fullWidth
            required
            label="Password"
            name="password"
            type="password"
            value={newUser.password}
            onChange={handleUserChange}
            error={!!userFormErrors.password}
            helperText={userFormErrors.password}
          />
          <TextField
            fullWidth
            required
            label="Email"
            name="email"
            type="email"
            value={newUser.email}
            onChange={handleUserChange}
            error={!!userFormErrors.email}
            helperText={userFormErrors.email}
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