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
          <h1 className="text-2xl font-bold">تسجيل الدخول إلى حسابك</h1>
          <p className="mt-2 text-sm text-gray-600">أدخل إذنك أدناه</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
