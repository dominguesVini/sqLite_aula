import { View, Text, Button, TextInput, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import CarRepository, { Car } from "../src/database/CarRepository";

const repository = new CarRepository();

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hpRange, setHpRange] = useState({ min: 0, max: 100 });

  const criarCarro = async () => {
    const id = await repository.create({
      brand: "VW",
      model: "Fusca",
      hp: Math.floor(Math.random() * 100),
    });
    console.log("Criado: ", id);
    listarTodos();
  };

  const listarTodos = async () => {
    const carros = await repository.all();
    setCars(carros);
    console.log(carros);
  };

  const deletarCarro = async (id: number) => {
    await repository.delete(id);
    console.log("Deletado ID: ", id);
    listarTodos();
  };

  const buscarPorModelo = async () => {
    const carros = await repository.searchByModel(searchTerm);
    setCars(carros);
  };

  const buscarPorFaixaDeHP = async () => {
    const carros = await repository.searchByHpRange(hpRange.min, hpRange.max);
    setCars(carros);
  };

  const atualizarCarro = async (carro: Car) => {
    await repository.update(carro);
    console.log("Atualizado: ", carro);
    listarTodos();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gerenciador de Carros</Text>

      <Button onPress={criarCarro} title="Adicionar Carro" color="#4CAF50" />
      <Button onPress={listarTodos} title="Listar Todos os Carros" color="#2196F3" />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buscar por Modelo</Text>
        <TextInput
          placeholder="Digite o modelo"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.input}
        />
        <Button onPress={buscarPorModelo} title="Buscar" color="#FF9800" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buscar por Faixa de HP</Text>
        <View style={styles.row}>
          <TextInput
            placeholder="HP Mínimo"
            keyboardType="numeric"
            value={String(hpRange.min)}
            onChangeText={(value) =>
              setHpRange((prev) => ({ ...prev, min: Number(value) }))
            }
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            placeholder="HP Máximo"
            keyboardType="numeric"
            value={String(hpRange.max)}
            onChangeText={(value) =>
              setHpRange((prev) => ({ ...prev, max: Number(value) }))
            }
            style={[styles.input, styles.halfInput]}
          />
        </View>
        <Button onPress={buscarPorFaixaDeHP} title="Buscar" color="#FF9800" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lista de Carros</Text>
        {cars.map((carro) => (
          <View key={carro.id} style={styles.card}>
            <Text style={styles.carText}>
              {carro.id} - {carro.brand} {carro.model} ({carro.hp} HP)
            </Text>
            <TextInput
              placeholder="Marca"
              value={carro.brand}
              onChangeText={(value) => {
                const updatedCar = { ...carro, brand: value };
                setCars((prev) => prev.map((c) => (c.id === carro.id ? updatedCar : c)));
              }}
              style={styles.input}
            />
            <TextInput
              placeholder="Modelo"
              value={carro.model}
              onChangeText={(value) => {
                const updatedCar = { ...carro, model: value };
                setCars((prev) => prev.map((c) => (c.id === carro.id ? updatedCar : c)));
              }}
              style={styles.input}
            />
            <TextInput
              placeholder="HP"
              keyboardType="numeric"
              value={String(carro.hp)}
              onChangeText={(value) => {
                const updatedCar = { ...carro, hp: Number(value) };
                setCars((prev) => prev.map((c) => (c.id === carro.id ? updatedCar : c)));
              }}
              style={styles.input}
            />
            <Button
              onPress={() => atualizarCarro(carro)}
              title="Atualizar"
              color="#78771b"
            />
            <Button
              onPress={() => deletarCarro(carro.id!)}
              title="Excluir"
              color="#F44336"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: "row",
  },
  card: {
    padding: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  carText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
