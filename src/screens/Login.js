import React from "react";
import * as SecureStore from "expo-secure-store";

import { useSetRecoilState } from "recoil";
import {
  StyleSheet,
  Button,
  Text,
  TextInput,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import { userState } from "../recoil/atoms/auth";
import LoginApi from "../api/login";

const loginApi = new LoginApi();
const image = {
  uri: "https://i.pinimg.com/564x/ce/07/58/ce0758f459be3d0abaa377c320b87316.jpg",
};

export default function LoginScreen() {
  const setUser = useSetRecoilState(userState);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState(null);

  const login = async () => {
    try {
      const data = await loginApi.login(username, password);
      setUser({
        loggedIn: true,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      await SecureStore.setItemAsync("access_token", data.access_token);
    } catch (error) {
      setUser({ loggedIn: false, access_token: null, refresh_token: null });
      setErrorMsg("Usuário ou senha inválidos!");
      await SecureStore.deleteItemAsync("access_token");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        <View style={styles.loginArea}>
          <Text style={styles.title}>Entrar</Text>
          <View style={styles.inputBlock}>
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
            />
          </View>
          <TouchableOpacity styles={styles.button}>
            <Button title="Sign in" onPress={() => login()} />
          </TouchableOpacity>
          <Text>{errorMsg}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
  },
  image: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  loginArea: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
    width: "95%",
    alignSelf: "center",
    padding: 30,
    borderRadius: 30,
    borderColor: "cyan",
    borderWidth: 1,
  },
  title: {
    color: "white",
    fontSize: 25,
  },
  inputBlock: {
    marginTop: 10,
    marginBottom: 30,
  },
  input: {
    color: "white",
    width: 120,
    fontSize: 12,
    borderWidth: 1,
    borderBottomColor: "white",
    textAlign: "center",
  },
  button: {
    borderRadius: 20,
  },
});
