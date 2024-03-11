import {
  Link,
  Form,
  redirect,
  useNavigate,
  useActionData,
} from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitBtn } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const errors = { msg: "" };
  if (data.password.length < 3) {
    errors.msg = "password too short";
    return errors;
  }

  try {
    await customFetch.post("/auth/login", data); // na ovaj endpoint šaljemo data (sve kaj user inputa u fieldove)
    toast.success("Login successful");
    return redirect("/dashboard");
  } catch (error) {
    // toast.error(error?.response?.data?.msg);
    errors.msg = errors?.response?.data?.msg;
    return errors;
  }
};

const Login = () => {
  const errors = useActionData();

  const navigate = useNavigate(); // koristimo u Component, u action funkciji redirect
  const loginDemoUser = async () => {
    // demo user, sa ograničenim modućnostima, pa može harcodiranje password
    const data = {
      email: "test@test.com",
      password: "secret123",
    };

    try {
      await customFetch.post("/auth/login", data);
      toast.success("Test the application");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
  };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>login</h4>
        {errors?.msg && <p style={{ color: "red" }}>{errors?.msg}</p>}
        <FormRow type="email" name="email"></FormRow>
        <FormRow type="password" name="password"></FormRow>
        <SubmitBtn />
        <button type="button" className="btn btn-block" onClick={loginDemoUser}>
          explore the app
        </button>
        <p>
          Not a member yet?
          <Link to="/register" className="member-btn">
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
    // trebamo oldschool link (<a>) za vanjske linkove
  );
};

export default Login;
