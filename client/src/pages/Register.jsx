import { Form, Link, redirect } from "react-router-dom"; // redirect koristiti samo s action funkcijom (formData)
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitBtn } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData(); // daje nam interface
  const data = Object.fromEntries(formData); // pretvara array of arrays u object. Ovo šaljemo na server
  console.log(data);

  try {
    // pošto je try/catch, tu se šalju podaci na server
    await customFetch.post("/auth/register", data);
    toast.success("Registration successful"); // tu možemo i access message s našeg servera (res.data.msg)
    return redirect("/login");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Register = () => {
  // const navigation = useNavigation();
  // console.log(navigation);
  // const isSubmitting = navigation.state === "submitting"; // samo ako je state "submitting", onda se izvršava
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        <FormRow type="text" name="name" />
        <FormRow type="text" name="lastName" labelText="last Name" />
        <FormRow type="text" name="location" />
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />
        <SubmitBtn formBtn />
        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Register;
