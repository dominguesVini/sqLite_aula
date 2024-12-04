import { StyleSheet, View } from "react-native";
import Home from "./app/Home";
import React from "react";

export default function App() {
  return <Home />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
