import { UserContext } from '../contexts/user.context';
import React, { useEffect, useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Stack,
  Button,
  Box,
  Paper,
  Container
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Todo = ({ todo, deleteTodo }) => (
  <ListItem
    secondaryAction={
      <>
        <IconButton
          edge="end"
          component={RouterLink}
          to={`/edit/${todo._id}`}
          sx={{ marginRight: 1 }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          edge="end"
          onClick={() => deleteTodo(todo._id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </>
    }
    divider
  >
    <ListItemButton>
    <ListItemText
      primary={todo.title}
      secondary={`${todo.description}, Due: ${todo.due}`}
    />
    </ListItemButton>
  </ListItem>
);

function TodoList() {
  const [todos, setTodos] = useState([]);
  const { logOutUser } = useContext(UserContext);
 
 // This function is called when the user clicks the "Logout" button.
 const logOut = async () => {
   try {
     // Calling the logOutUser function from the user context.
     const loggedOut = await logOutUser();
     // Now we will refresh the page, and the user will be logged out and
     // redirected to the login page because of the <PrivateRoute /> component.
     if (loggedOut) {
       window.location.reload(true);
     }
   } catch (error) {
     alert(error)
   }
 }

  useEffect(() => {
    async function getTodos() {
      const response = await fetch(`http://localhost:5050/task/`);
      if (!response.ok) {
        console.error(`An error occurred: ${response.statusText}`);
        return;
      }
      const todos = await response.json();
      setTodos(todos);
    }
    getTodos();
  }, []);

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5050/task/${id}`, {
      method: 'DELETE',
    });
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  return (
    <>
      
      <Container maxWidth="md">
        
        <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'end',
              '& > *': {
                m: 1,
              },
            }}
          >
            <Stack direction="row" spacing={2}>
              <Button variant='contained' startIcon={<AddIcon />} color="primary" component={RouterLink} to="/create-todo">New Todo</Button>
              <Button variant='contained' color="inherit" onClick={logOut}>Logout</Button>
            </Stack>
          </Box>
          <List dense component={Paper}>
            {todos.map((todo) => (
              <Todo
                key={todo._id}
                todo={todo}
                deleteTodo={deleteTodo}
              />
            ))}
          </List>
      </Container>
    </>
  );
}

export default TodoList;