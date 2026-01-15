interface WelcomeMailParams {
  name: string;
  email: string;
  password: string;
}

export const welcomeUserTemplate = ({
  name,
  email,
  password,
}: WelcomeMailParams) => {
  return {
    subject: "Welcome to Our Platform 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${name},</h2>
        <p>Your account has been successfully created.</p>

        <p><strong>Login Credentials:</strong></p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>

        <p>Please login and change your password after your first login.</p>

        <p>Best Regards,<br/>Team Support</p>
      </div>
    `,
  };
};
