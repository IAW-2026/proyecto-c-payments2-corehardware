"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const email = formData.get("email") as string;
  const mensaje = formData.get("mensaje") as string;

  if (!nombre || !email || !mensaje) {
    return { error: "Completá todos los campos." };
  }

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: ["delivered@resend.dev"],
    subject: `Nuevo mensaje de ${nombre}`,
    replyTo: email,
    text: `Nombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`,
  });

  if (error) return { error: "No se pudo enviar. Intentá de nuevo." };
  return { success: true };
}