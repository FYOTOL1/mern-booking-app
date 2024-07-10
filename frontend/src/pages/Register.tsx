import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Register Successfully!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="text-gray-700 text-xm font-bold flex-1">
          First Name
          <input
            autoComplete="off"
            className="border border-gray-300 rounded w-full py-1 px-2 font-normal"
            {...register("firstName", { required: "This Field Is Required" })}
            type="text"
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-xm font-bold flex-1">
          Last Name
          <input
            autoComplete="off"
            className="border border-gray-300 rounded w-full py-1 px-2 font-normal"
            {...register("lastName", { required: "This Field Is Required" })}
            type="text"
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-xm font-bold flex-1">
        Email
        <input
          autoComplete="off"
          className="border border-gray-300 rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This Field Is Required" })}
          type="email"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-xm font-bold flex-1">
        Password
        <input
          autoComplete="off"
          className="border border-gray-300 rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This Field Is Required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          type="password"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-xm font-bold flex-1">
        Confirm Password
        <input
          autoComplete="off"
          className="border border-gray-300 rounded w-full py-1 px-2 font-normal"
          {...register("confirmPassword", {
            validate: (v) => {
              if (!v) {
                return "This Field is Required";
              } else if (watch("password") !== v) {
                return "Passwords Don't Match";
              }
            },
          })}
          type="password"
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;
