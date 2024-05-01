import {useEffect, useState } from "react";
import { useParams, useNavigate} from 'react-router-dom';
import { TextField, Button, Box, Container } from '@mui/material';

export default function Todo() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    due: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
      const response = await fetch(`http://localhost:5050/task/${id}`);
      if (!response.ok) {
        console.error(`An error has occurred: ${response.statusText}`);
        return;
      }
      const todo = await response.json();
      if (!todo) {
        console.warn(`Todo with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(todo);
    }
    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const item = { ...form };
    try {
      let response;
      if (isNew) {
        response = await fetch("http://localhost:5050/task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      } else {
        response = await fetch(`http://localhost:5050/task/${params.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/");
    } catch (error) {
      console.error('A problem occurred adding or updating a todo: ', error);
    } finally {
      setForm({ title: "", description: "", due: "" });
      navigate("/");
    }
  }

  return (
    <Container maxWidth="sm">
      <h1>Create/Update Todo</h1>
      <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="title"
          label="Tile"
          title="title"
          autoComplete="title"
          autoFocus
          value={form.title}
          onChange={(e) => updateForm({ title: e.target.value })}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="decription"
          label="Description"
          description="description"
          autoComplete="description"
          value={form.description}
          onChange={(e) => updateForm({ description: e.target.value })}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          type='date'
          id="due"
          label="Due"
          due="due"
          placeholder=''
          autoComplete="due"
          value={form.due}
          onChange={(e) => updateForm({ due: e.target.value })}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onSubmit={onSubmit}
        >
          Save Todo
        </Button>
      </Box>
    </Container>
  );
}