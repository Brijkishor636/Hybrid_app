import { useEffect } from "react";
import { Preferences } from "@capacitor/preferences";

export default function Dashboard() {
  useEffect(() => {
    const checkAuth = async () => {
      const token = await Preferences.get({ key: "token" });
      if (!token.value) window.location.href = "/login";
    };
    checkAuth();
  }, []);

  return <h1>Welcome to Dashboard</h1>;
}
