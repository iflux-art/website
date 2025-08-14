import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-card border border-border shadow-lg rounded-lg p-6",
              headerTitle:
                "text-2xl font-bold text-center mb-2 text-foreground",
              headerSubtitle: "text-muted-foreground text-center mb-6 text-sm",
              socialButtonsBlockButton:
                "border border-border hover:bg-accent transition-colors rounded-md h-10 text-sm font-medium",
              socialButtonsBlockButtonText: "text-foreground",
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-10 text-sm font-medium w-full transition-colors",
              formFieldInput:
                "border border-border bg-background text-foreground rounded-md h-10 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              formFieldLabel: "text-foreground font-medium text-sm mb-2 block",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-primary hover:text-primary/80",
              footerActionText: "text-muted-foreground text-sm",
              footerActionLink:
                "text-primary hover:text-primary/80 text-sm font-medium",
              dividerLine: "bg-border",
              dividerText:
                "text-muted-foreground text-xs uppercase px-2 bg-background",
              otpCodeFieldInput:
                "border border-border bg-background text-foreground rounded-md h-10 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              formResendCodeLink: "text-primary hover:text-primary/80 text-sm",
              alertText: "text-destructive text-sm",
              formFieldErrorText: "text-destructive text-sm mt-1",
              identityPreview:
                "border border-border rounded-md p-3 bg-muted/50",
              formHeaderTitle: "text-lg font-semibold text-foreground mb-2",
              formHeaderSubtitle: "text-muted-foreground text-sm mb-4",
            },
            variables: {
              colorPrimary: "hsl(var(--primary))",
              colorBackground: "hsl(var(--background))",
              colorInputBackground: "hsl(var(--background))",
              colorInputText: "hsl(var(--foreground))",
              colorText: "hsl(var(--foreground))",
              colorTextSecondary: "hsl(var(--muted-foreground))",
              colorDanger: "hsl(var(--destructive))",
              colorSuccess: "hsl(var(--primary))",
              colorWarning: "hsl(var(--warning))",
              colorNeutral: "hsl(var(--muted))",
              fontFamily: "var(--font-sans)",
              borderRadius: "0.5rem",
              spacingUnit: "1rem",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/admin"
          afterSignUpUrl="/admin"
        />
      </div>
    </div>
  );
}
