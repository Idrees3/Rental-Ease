import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export type ReminderEmailParams = {
  to: string;
  subject: string;
  title: string;
  body: string;
  amountQar?: number;
  dueDate?: string;
};

export async function sendReminderEmail(params: ReminderEmailParams) {
  const from = process.env.RESEND_FROM_EMAIL ?? "Rental Ease <reminders@rentalease.app>";

  const amountLine =
    params.amountQar != null
      ? `<p style="font-size:18px;font-weight:600;">${params.amountQar.toLocaleString("en-QA")} QAR</p>`
      : "";

  const dueLine = params.dueDate
    ? `<p style="color:#64748b;">Due: ${params.dueDate}</p>`
    : "";

  const { data, error } = await getResend().emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h1 style="color:#8A1538;font-size:20px;">Rental Ease</h1>
        <h2 style="font-size:18px;">${params.title}</h2>
        ${amountLine}
        ${dueLine}
        <p style="margin-top:16px;">${params.body}</p>
      </div>
    `,
  });

  if (error) throw error;
  return data;
}
