import { useCallback, useState } from "react";
import {
  Animated,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Link, useFocusEffect } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useDebounceCallback } from "usehooks-ts";

import type { TodosSelect } from "~/stores/todoStore";
import {
  createTodos,
  deleteTodo,
  findTodos,
  toggleTodo,
  updateTodo,
} from "~/stores/todoStore";
import { api } from "~/utils/api";
import { FlexScrollView } from "../_components/ui/FlexScrollView";

export default function Todos() {
  const [todos, setTodos] = useState<TodosSelect[]>([]);

  const { data: todosFromServer } = api.todo.readAll.useQuery();

  const fetchData = async () => {
    const result = await findTodos();
    setTodos(result);
  };

  useFocusEffect(
    useCallback(() => {
      void fetchData();
    }, []),
  );

  const addTodo = async (text: string) => {
    const todo = (await createTodos({ text })) as TodosSelect;
    setTodos((prev) => [...prev, todo]);
  };

  const handleTodoToggle = (todoUpdate: TodosSelect) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoUpdate.id
          ? { ...todo, complete: !todo.complete }
          : todo,
      ),
    );
    void toggleTodo(todoUpdate.id, !todoUpdate.complete);
  };

  const debouncedUpdate = useDebounceCallback(updateTodo, 800);
  const handleTodoUpdate = (todoUpdate: TodosSelect) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoUpdate.id ? { ...todo, text: todoUpdate.text } : todo,
      ),
    );
    void debouncedUpdate(todoUpdate);
  };

  const handleSwipe = async (
    direction: "left" | "right",
    swipeable: Swipeable,
    todo: TodosSelect,
  ) => {
    switch (direction) {
      case "right":
        await deleteTodo(todo.id);
        setTodos((prev) => prev.filter((t) => t.id !== todo.id));
        swipeable.close();
        break;
      case "left":
        // currently doing nothing
        break;
    }
  };

  const importSampleTodos = async () => {
    const sampleTodos = [
      {
        text: "Finish creating an app to track todos",
      },
      {
        text: "Enhance it to take photos of things we would like to remedy",
      },
      {
        text: "Copy another todo app to make it more feature rich",
      },
    ] as TodosSelect[];
    for (const todo of sampleTodos) {
      await createTodos({ text: todo.text });
    }
    void fetchData();
  };

  return (
    <SafeAreaView className="bg-black">
      <View className="flex h-screen bg-black px-2">
        {todos.length === 0 && (
          <View className="my-4 flex items-center justify-center gap-2">
            <Text className="text-xl font-bold text-white">
              There are no todos, please either
            </Text>
            <Pressable
              onPress={importSampleTodos}
              className="bg-stone-500 rounded px-4 py-2">
              <Text className="text-2xl">Import sample todos</Text>
            </Pressable>
            <Text className="text-xl font-bold text-white">or add one</Text>
          </View>
        )}
        <View>
          <Text className="text-white">
            From server: {todosFromServer?.length}
          </Text>
        </View>
        <FlexScrollView>
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              handleTodoToggle={handleTodoToggle}
              handleSwipe={handleSwipe}
              handleTodoUpdate={handleTodoUpdate}
            />
          ))}
          <NewTodo addTodo={addTodo} />
        </FlexScrollView>
      </View>
    </SafeAreaView>
  );
}

const NewTodo = ({ addTodo }: { addTodo: (text: string) => void }) => {
  const [newTodo, setNewTodo] = useState("");
  const handleAdd = () => {
    addTodo(newTodo);
    setNewTodo("");
  };

  return (
    <View className="border-stone-400 flex min-h-[80px] w-full flex-row items-center gap-4 rounded border p-2">
      <View className="flex flex-grow">
        <TextInput
          value={newTodo}
          onChangeText={(t) => setNewTodo(t)}
          multiline
          numberOfLines={4}
          placeholder="New todo..."
          className="placeholder:text-gray-400 font-semibold text-white"
        />
      </View>
      <Pressable onPress={handleAdd}>
        <FontAwesome6 name="plus" size={32} color="white" />
      </Pressable>
    </View>
  );
};

const TodoCard = ({
  todo,
  handleTodoToggle,
  handleSwipe,
  handleTodoUpdate,
}: {
  todo: TodosSelect;
  handleTodoToggle: (todo: TodosSelect) => void;
  handleSwipe: (
    direction: "left" | "right",
    swipeable: Swipeable,
    todo: TodosSelect,
  ) => void;
  handleTodoUpdate: (todo: TodosSelect) => void;
}) => {
  return (
    <Link href={`/(todos)/${todo.id}`} asChild disabled={todo.id === -1}>
      <Pressable>
        <Swipeable
          renderRightActions={RightActions}
          onSwipeableOpen={(direction, swipeable) =>
            handleSwipe(direction, swipeable, todo)
          }>
          <View className="bg-stone-400 flex min-h-[100px] w-full flex-row items-center gap-4 rounded p-2">
            <Pressable
              onPress={() => handleTodoToggle(todo)}
              className={`h-8 w-8 rounded-full border ${todo.complete ? "bg-green-600" : ""}`}
            />
            {/* w-0 is not a typo, it is what makes the text wrap for some reason */}
            <View className="flex w-0 flex-grow">
              <TextInput
                value={todo.text}
                onChangeText={(t) => handleTodoUpdate({ ...todo, text: t })}
                multiline
                numberOfLines={4}
                className="font-semibold"
              />
            </View>
            <View>
              <Entypo name="stopwatch" size={36} color="black" />
            </View>
          </View>
        </Swipeable>
      </Pressable>
    </Link>
  );
};

const RightActions = (
  progress: Animated.AnimatedInterpolation<string | number>,
  dragX: Animated.AnimatedInterpolation<string | number>,
) => {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [0.7, 0],
  });

  return (
    <View className="bg-red-600 flex-1 items-end justify-center">
      <Animated.Text
        style={{
          color: "white",
          paddingHorizontal: 65,
          fontWeight: "600",
          transform: [{ scale }],
        }}>
        Delete
      </Animated.Text>
    </View>
  );
};
