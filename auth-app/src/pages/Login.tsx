import { useState } from "react";
import axios from "axios";
import { Preferences } from "@capacitor/preferences";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await axios.post("http://localhost:3001/api/v1/user/signin", {
      username, password
    });

    await Preferences.set({
      key: "token",
      value: res.data.token
    });

    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password"
        onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
}
