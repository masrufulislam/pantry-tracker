'use client'
import { Box, Stack, TextField, Typography, Button, Modal } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

// Modal styles
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%', // Responsive width
  maxWidth: 400, // Maximum width
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3
};

// Main component
export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    const snapshot = collection(firestore, 'pantry-app');
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry-app'), item.trim().toLowerCase());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry-app'), item.trim().toLowerCase());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Box
        width="100%"
        bgcolor="#000000"
        color="#ffffff"
        padding={2}
        display="flex"
        justifyContent="center"
        position="fixed"
        top={0}
        zIndex={1000}
        style={{ fontFamily: 'Brisk Script', fontSize: '1.5rem' }} // Apply font and responsive font size
      >
        <Typography variant="h5">Pantry Tracker 📝</Typography>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item ➕
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              style={{ fontFamily: 'Brisk Script', fontSize: '0.9rem' }} // Apply font and responsive font size
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
        style={{ fontSize: '0.9rem', padding: '8px 16px', marginTop: '125px' }} // Responsive button
      >
        Add More Items (+)
      </Button>
      <Box
        border="5px solid #122b30"
        width="90%" // Responsive width
        maxWidth="800px" // Maximum width
        padding={2}
        marginTop={2}
      >
        <Box
          width="100%"
          height="100px"
          bgcolor="#000000"
          display="flex"
          justifyContent="center"
          alignItems="center"
          border="3px solid #122b30"
        >
          <Typography
            variant="h3"
            color="#ffffff"
            textAlign="center"
            style={{ fontFamily: 'Brisk Script', fontSize: '2rem' }} // Apply font and responsive font size
          >
            Pantry Items 📜
          </Typography>
        </Box>
        <Stack
          width="100%"
          height="400px"
          overflow="auto"
          spacing={2}
          marginTop={2}
        >
          {pantry.map(({ name, count }) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#f0f0f0"
              paddingX={2}
              border="2px solid #122b30"
              borderRadius="4px"
              style={{ fontSize: '1rem' }} // Responsive font size
            >
              <Typography
                variant="h4"
                color="#333"
                textAlign="center"
                style={{ fontFamily: 'Brisk Script', fontSize: '1.2rem' }} // Apply font and responsive font size
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h5"
                color="#333"
                textAlign="center"
                style={{ fontFamily: 'Brisk Script', fontSize: '1rem' }} // Apply font and responsive font size
              >
                Quantity: {count}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                  style={{ fontSize: '0.8rem', padding: '4px 8px' }} // Responsive button
                >
                  Add (+)
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                  style={{ fontSize: '0.8rem', padding: '4px 8px' }} // Responsive button
                >
                  Remove (-)
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
