'use client'
import {Box, Stack, TextField, Typography, Button, Modal} from '@mui/material';
import {firestore} from '@/firebase';
import {collection, doc, getDocs, setDoc, deleteDoc, getDoc} from 'firebase/firestore';
import {useEffect, useState} from 'react';

const style = {
  position: 'absolute', 
  top: '50%', 
  left: '50%', 
  transform: 'translate(-50%, -50%)',
  width: 400, 
  bgcolor: 'white', 
  border: '2px solid #000', 
  boxShadow: 24, 
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3 
};

export default function Home() {

  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState('');

  const updatePantry = async () => {
    const snapshot = collection(firestore, 'pantry-app');
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({name: doc.id, ...doc.data()});
    });
    console.log(pantryList);
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
      height="105vh"
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
        style={{ fontFamily: 'Brisk Script' }}  // Apply font
      >
        <Typography variant="h5">Pantry Tracker 📝</Typography>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
                setItemName(' ');
                handleClose();
              }}
              style={{ fontFamily: 'Brisk Script' }}  // Apply font
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>Add More Items (+)</Button>
      <Box border="5px solid #122b30">
        <Box 
          width="800px" 
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
            style={{ fontFamily: 'Brisk Script' }}  // Apply font
          >
            Pantry Items 📜
          </Typography>
        </Box>
        <Stack width="800px" height="400px" overflow="scroll">
          {pantry.map(({name, count}) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#f0f0f0"
              paddingX={7}
              border="2px solid #122b30"
            >
              <Typography 
                variant="h4" 
                color="#333" 
                textAlign="center"
                style={{ fontFamily: 'Brisk Script' }}  // Apply font
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography 
                variant="h5" 
                color="#333" 
                textAlign="center"
                style={{ fontFamily: 'Brisk Script' }}  // Apply font
              >
                Quantity: {count}
              </Typography>
              <Button variant="contained" onClick={() => addItem(name)}>Add (+)</Button>
              <Button variant="contained" onClick={() => removeItem(name)}>Remove (-)</Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
