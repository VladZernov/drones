'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function login() {
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        console.log(res);

        if (res?.ok) {
            router.push("/");
        } else {
            alert("Invalid credentials");
        }
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Login</h1>

            <input
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={login}>Sign in</button>
        </div>
    );
}