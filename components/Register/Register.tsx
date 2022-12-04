import { useState } from "react";
import classes from "./Register.module.css";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");

  //e: HTMLInputElement
  function fieldsHandler(e: any) {
    switch (e.id) {
      case "email":
        setEmail(e.value);
        break;
      case "password":
        setPassword(e.value);
        break;
      case "role":
        console.log(e);
        setRole(e.value);
        break;
      default:
        break;
    }
  }

  return (
    <div className={classes.loginSection}>
      <div className={classes.role}>
        <label htmlFor="selectRole">Choose a role:</label>
        <select
          id="role"
          name="selectRole"
          onClick={(e) => fieldsHandler(e.target)}
        >
          <option value="Admin">Admin</option>
          <option value="Teacher">Teacher</option>
          <option value="Student">Student</option>
        </select>
      </div>

      <input
        id="email"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => {
          fieldsHandler(e.target);
        }}
      />

      <input
        id="password"
        type="text"
        placeholder="Enter password"
        value={password}
        onChange={(e) => {
          fieldsHandler(e.target);
        }}
      />
      <div className={classes.buttons}>
        <button
          onClick={() => {
            alert("Register");
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
