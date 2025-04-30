import SignInForm from "./components/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials below
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
