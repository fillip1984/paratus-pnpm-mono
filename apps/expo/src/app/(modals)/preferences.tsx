import { useState } from "react";
import { Alert, Pressable, SafeAreaView, Text, View } from "react-native";
import { router } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

import { localDb } from "~/db";
import { bloodPressureReadings } from "~/db/schema";
import { createActivitiesFromRoutine } from "~/stores/activityStore";
import { deleteRoutine, findRoutines } from "~/stores/routineStore";
import { useSignOut, useUser } from "~/utils/auth";

export default function Preferences() {
  const [rebuilding, setRebuilding] = useState(false);

  const user = useUser();
  const signOut = useSignOut();

  const confirmRebuild = () => {
    Alert.alert(
      "Are you sure?",
      "This will delete activities and their outcomes and rebuild them.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: void rebuildActivities,
        },
      ],
    );
  };

  const rebuildActivities = async () => {
    // TODO: work on reactivity, the rebuilding flag isn't getting rendered. Would be nice to get a check mark once it happens that remains for a few seconds
    setRebuilding(true);
    await deleteOutcomes();
    const routines = await findRoutines();
    for (const routine of routines) {
      await createActivitiesFromRoutine(routine.id);
    }
    setRebuilding(false);
    router.dismiss();
  };

  const confirmDelete = () => {
    Alert.alert(
      "Are you sure?",
      "This will delete all routines, this cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: void deleteRoutines,
        },
      ],
    );
  };

  // TODO: should we allow this to go to production?
  const deleteRoutines = async () => {
    const routines = await findRoutines();
    for (const routine of routines) {
      await deleteRoutine(routine.id);
    }
    await deleteOutcomes();
    router.dismiss();
  };

  const deleteOutcomes = async () => {
    await localDb.delete(bloodPressureReadings);
    console.warn("Still work in progress to clear out outcomes");
  };

  return (
    <SafeAreaView className="bg-stone-800">
      <View className="p-2">
        <Text className="text-white">User: {user?.name}</Text>
        <Pressable
          onPress={signOut}
          className="bg-yellow-800 mx-auto w-1/2 rounded px-4 py-2">
          <Text className="text-center text-2xl uppercase text-white">
            Sign out
          </Text>
        </Pressable>
      </View>
      <View className="h-full p-2">
        <Text className="text-xl text-white">
          Rebuilding activities will recreate all activities for all routines.
        </Text>
        <Text className="font-bold uppercase text-white">
          All activity history will be lost!
        </Text>
        <Pressable
          onPress={confirmRebuild}
          className="bg-red-600 m-2 flex-row items-center justify-center gap-4 rounded p-2">
          <Text className="text-2xl">Rebuild Activities</Text>
          {rebuilding && (
            <View className="animate-spin">
              <FontAwesome6 name="circle-notch" size={24} color="black" />
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={confirmDelete}
          className="border-red-600 m-2 rounded border p-2">
          <Text className="text-red-600 text-center text-2xl">
            Delete all routines
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
