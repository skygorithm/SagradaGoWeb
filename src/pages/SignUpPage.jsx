import React, { useContext, useState } from "react";
import Button from "../components/Button";
import { NavbarContext } from "../context/AllContext";


export default function SignUpPage() {
  const { setShowSignup, setShowSignin } = useContext(NavbarContext);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [showPass, setShowPass] = useState(false)

  async function Signup(){
    alert("Sign up")
    
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="bg-white rounded-2xl shadow-xl p-8! flex flex-col justify-center items-center gap-2">
          <div className="w-full flex justify-end">
            <button 
              className="cursor-pointer"
              onClick={() => {
                setShowSignup(false)
                setShowSignin(false)
              }}
              
            >
              X
            </button>

          </div>
          <h1 className="text-black">Email</h1>
          <input
            type="email"
            onChange={(e) => setInputEmail(e.target.value)}
            className="bg-white border"
          />
          <h1 className="text-black">Password</h1>
          <input
            type={`${showPass ? "text" : "password"}`}
            onChange={(e) => setInputPassword(e.target.value)}
            className="bg-white border"
          />
          <Button 
            color={"#b87d3e"}
            textColor={"#ffffff"}
            text={"Sign up"}
            onClick={Signup}
          />
          <button
            onClick={() => setShowSignup(false)}
            className="cursor-pointer"
          >
            Already have an account?
          </button>
        </div>
      </div>
    </>
  );
}
