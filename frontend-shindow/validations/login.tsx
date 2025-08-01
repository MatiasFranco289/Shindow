import * as Yup from "yup";

const loginValidationSchema = Yup.object().shape({
  username: Yup.string().required("This field is required."),
});

export default loginValidationSchema;
