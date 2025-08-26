import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-background p-4">
    <div className="w-full max-w-md">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        redirectUrl="/admin"
        afterSignInUrl="/admin"
      />
    </div>
  </div>
);

export default SignInPage;
