import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    await axios.post("http://localhost:3001/api/v1/user/signup", {
      name, username, password
    });
    alert("Signup successful");
    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Signup</h2>
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password"
        onChange={e => setPassword(e.target.value)} />
      <button onClick={signup}>Signup</button>
    </div>
  );
}
