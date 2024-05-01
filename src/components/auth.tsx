// src/components/auth.tsx
import React from 'react';
import {useState} from "react";
import {auth, googleProvider} from "../config/firebase-config";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
interface AuthProps {

}

export const Auth: React.FC<AuthProps> = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
      //console.log(auth?.currentUser?.email);// Use optional chaining to safely access email, prevent null
  const validateForm = () => {
    if (!email || !password) {
        setError("Email and password are required");
        return false;
        }
    if (!email.includes('@')) {
        setError("Please enter a valid email");
        return false;
    }
    setError("");
    return true;
};
  const signIn = async ()=> {
      try{
        await createUserWithEmailAndPassword(auth, email, password);
      }catch(err) {
        console.error(err);
      }
  };

  const signInWithGoogle = async ()=> {
    try{
      await signInWithPopup(auth, googleProvider);
    }catch(err) {
      console.error(err);
    }
  };

  const logout = async ()=> {
    try{
      await signOut(auth);
    }catch(err) {
      console.error(err);
    }
  };
  return (
    <div>
      <input placeholder="Email..." 
      type ="email"
      onChange ={(e) => setEmail(e.target.value)}
      /> 
      <input 
      placeholder="Password..." 
      type ="password"
      onChange ={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}> Sign In</button>

      <button onClick={signInWithGoogle}> Sign In With Google</button>

      <button onClick={logout}> Logout</button>
    </div>
  );
};
