import React, { useState } from "react";
import { Box, Heading, Input, Button, Stack, Checkbox, Select, Text, IconButton, Flex, Spacer, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("low");
  const [newDueDate, setNewDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("priority");
  const toast = useToast();

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const task = {
        id: Date.now(),
        description: newTask,
        completed: false,
        priority: newPriority,
        dueDate: newDueDate,
      };
      setTasks([...tasks, task]);
      setNewTask("");
      setNewPriority("low");
      setNewDueDate("");
      toast({
        title: "Task added.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));
    setTasks(updatedTasks);
  };

  const handleRemoveTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    toast({
      title: "Task removed.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEditTask = (id, description, priority, dueDate) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, description, priority, dueDate } : task));
    setTasks(updatedTasks);
    toast({
      title: "Task updated.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sort === "priority") {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sort === "dueDate") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  return (
    <Box maxWidth="600px" margin="auto" p={4}>
      <Heading as="h1" size="xl" textAlign="center" mb={8}>
        Task Manager
      </Heading>
      <Stack spacing={4}>
        <Flex>
          <Input placeholder="Enter a new task" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
          <Select value={newPriority} onChange={(e) => setNewPriority(e.target.value)} ml={2} width="120px">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <Input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} ml={2} />
          <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={handleAddTask} ml={2}>
            Add Task
          </Button>
        </Flex>
        <Flex>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} width="150px">
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </Select>
          <Spacer />
          <Select value={sort} onChange={(e) => setSort(e.target.value)} width="150px">
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
          </Select>
        </Flex>
        {sortedTasks.map((task) => (
          <Box key={task.id} p={4} borderWidth={1} borderRadius="md" backgroundColor={task.completed ? "gray.100" : "white"}>
            <Flex align="center">
              <Checkbox isChecked={task.completed} onChange={() => handleToggleComplete(task.id)} mr={4} />
              <Text textDecoration={task.completed ? "line-through" : "none"} flexGrow={1}>
                {task.description}
              </Text>
              <Text fontSize="sm" color={task.priority === "high" ? "red.500" : task.priority === "medium" ? "orange.500" : "green.500"} mr={4}>
                {task.priority}
              </Text>
              <Text fontSize="sm" mr={4}>
                {task.dueDate}
              </Text>
              <IconButton icon={<FaEdit />} aria-label="Edit Task" size="sm" mr={2} onClick={() => handleEditTask(task.id, prompt("Enter updated task description", task.description), prompt("Enter updated priority (low, medium, high)", task.priority), prompt("Enter updated due date (YYYY-MM-DD)", task.dueDate))} />
              <IconButton icon={<FaTrash />} aria-label="Remove Task" size="sm" onClick={() => handleRemoveTask(task.id)} />
            </Flex>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Index;
