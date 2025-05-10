import { useState } from "react";
import googleIcon from "../assets/google.png";
import Meet from "../assets/Meet_img.jpg";
import { auth } from "../components/firebaseConfig"; // adjust path if needed
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

 const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
   e.preventDefault();

   const { email, password } = formData;

   if (isSignUp) {
     try {
       const userCredential = await createUserWithEmailAndPassword(
         auth,
         email,
         password
       );
       await sendEmailVerification(userCredential.user);
       alert(
         "Verification email sent! Please check your inbox before logging in."
       );
       setIsSignUp(false); // Flip back to sign-in mode after signup
     } catch (error) {
       console.error("Sign Up Error:", error.message);
       alert(error.message);
     }
   } else {
     try {
       const userCredential = await signInWithEmailAndPassword(
         auth,
         email,
         password
       );
       if (!userCredential.user.emailVerified) {
         alert("Please verify your email before signing in.");
         return;
       }
       alert("Sign In Successful!");
      navigate("/booking");

     } catch (error) {
       console.error("Sign In Error:", error.message);
       alert(error.message);
     }
   }
 };


  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Google Sign-In Successful!");
      navigate("/booking");

    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-gradient-to-r from-[#c2e6f2] to-[#89cfe6] items-center justify-center overflow-hidden">
      <div className="bg-[#f3f3f3] w-4/5 max-w-4xl rounded-lg shadow-lg flex overflow-hidden relative">
        {/* Left Side - Form */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl text-black font-bold text-center mb-6">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm w-full text-black cursor-pointer bg-white"
            >
              <img src={googleIcon} alt="Google" className="w-5 h-5" />
              Log in with Google
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 rounded-lg shadow focus:ring-2 focus:ring-[#89cfe6] text-black"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 rounded-lg shadow focus:ring-2 focus:ring-[#89cfe6] text-black"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 shadow rounded-lg focus:ring-2 focus:ring-[#89cfe6] text-black"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#89cfe6] hover:bg-[#7ecae4] transition py-2 rounded-lg font-bold text-black cursor-pointer"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-black">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              className="text-[#2eb4e0] ml-1 underline focus:outline-none cursor-pointer"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 relative">
          <img
            src={Meet}
            alt="Meeting"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
export default AuthForm