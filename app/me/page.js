'use client';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Typography, Box, Modal, Stack, TextField, Button, Paper, Select, MenuItem } from '@mui/material';
import { collection, getDocs, doc, deleteDoc, query, getDoc, setDoc } from 'firebase/firestore';
import ResponsiveAppBar from './appBar';  // Import ResponsiveAppBar
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filtered, setFiltered] = useState([]); // for search bar 
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const { user, isLoading } = useUser(); // Get user info
  const [category, setCategory] = useState(' ')
  const categories = ["Dairy", "Grains", "Vegetables", "Fruits", "Meat", "Beverages", "Miscellaneous"];


  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    setInventory(inventoryList);
    setFiltered(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item, category) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 , category});
    } else {
      await setDoc(docRef, { count: 1 , category});
    }

    await updateInventory();
  };

  const searchItem = (query) => {
    const items = query.toLowerCase()
    const filtered = inventory.filter(item => item.name.toLowerCase().includes(items))
    setFiltered(filtered)
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/logout?returnTo=/';
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (isLoading) return <div>Loading...</div>;  // handles loading 

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column">
      <ResponsiveAppBar user = {user} onSearch= {searchItem} onLogout= {handleLogout}/>

      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        height="100%" 
        width="100%"
      >
        <Paper elevation={3} sx={{ width: '90%', maxWidth: '500px', p: 2 }}>
          <Typography variant="h4" color="#333" textAlign="center" gutterBottom>
            Pantry Items
          </Typography>
          <Stack spacing={2}>
            {filtered.map(({ name, count, category }) => (
              <Box
                key={name}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                sx={{ backgroundColor: '#f0f0f0', borderRadius: 1 }}
              >
                <Typography variant="h6" color="#333" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)} - {category}
                </Typography>
                <Typography variant="h6" color="#333" textAlign="center">
                  {count}
                </Typography>
                <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => addItem(name)}>
                
                  Add
                </Button>

                  <Button variant="contained" onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ mt: 3 }} 
            onClick={handleOpen}
          >
            Add New Item
          </Button>
        </Paper>

        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{ transform: 'translate(-50%, -50%)' }}
            width={400}
            bgcolor="white"
            border="2px solid #000"
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                label = "item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
              />
              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)} // Handles the user's selection
                fullWidth
                variant="outlined"
              >
                {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                      {cat}
                </MenuItem>
              ))}
              </Select>
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName, category);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

