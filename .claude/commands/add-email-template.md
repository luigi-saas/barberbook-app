# Add Email Template

Create a new transactional email template in `packages/email`.

Steps:
1. Ask for the template name and its purpose (e.g. `booking-confirmation`, `appointment-reminder`)
2. Create `packages/email/templates/<template-name>.tsx` using React Email components
3. Export a typed props interface and the component as default export
4. Export the template from `packages/email/index.ts`
5. Add a send helper function in `packages/email/index.ts`:
   ```ts
   export const sendBookingConfirmation = (props: TemplateProps) =>
     resend?.emails.send({
       from: 'BarberBook <noreply@yourdomain.com>',
       to: props.email,
       subject: '...',
       react: <TemplateName {...props} />,
     });
   ```
6. Preview it by running `bun dev --filter email` and opening localhost:3003

Note: Use only React Email components (`@react-email/components`), not regular HTML or Tailwind.
