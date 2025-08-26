import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-background p-4">
    <div className="w-full max-w-md">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        redirectUrl="/admin"
        afterSignUpUrl="/admin"
      />
    </div>
  </div>
);

export default SignUpPage;
