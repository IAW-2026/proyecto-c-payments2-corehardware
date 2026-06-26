"use client";

import { useRef, useState, useTransition } from "react";
import { sendContactEmail } from "@/actions/contact";


export function ContactSection() {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await sendContactEmail(data);
            if (res?.error) {
                setErrorMsg(res.error);
                setStatus("error");
            } else {
                setStatus("success");
                formRef.current?.reset();
            }
        });
    }

    return (
        <section className="py-20 px-6 border-t border-neutral-200 dark:border-neutral-900">
            <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <p className="text-xs font-mono text-green-600 dark:text-green-500 uppercase tracking-widest mb-3">Contacto</p>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-3">
                        ¿Trabajás con nosotros?
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Si sos parte del equipo de logística o necesitás acceso como shipper, contactanos directamente. El acceso a esa plataforma se gestiona de forma interna.
                    </p>
                </div>
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-4"
                >
                    <div className="space-y-1.5">
                        <label htmlFor="nombre" className="text-xs font-medium text-neutral-400">Nombre</label>
                        <input type="text" id="nombre" name="nombre" required placeholder="Tu nombre"
                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-700 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10 dark:focus:border-green-500 dark:focus:ring-green-500/10 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-medium text-neutral-400">Email</label>
                        <input type="email" id="email" name="email" required placeholder="tu@email.com"
                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-700 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10 dark:focus:border-green-500 dark:focus:ring-green-500/10 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="mensaje" className="text-xs font-medium text-neutral-400">Mensaje</label>
                        <textarea id="mensaje" name="mensaje" rows={3} required placeholder="Contanos en qué podemos ayudarte..."
                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-700 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/10 dark:focus:border-green-500 dark:focus:ring-green-500/10 transition-all resize-none"
                        />
                    </div>
                    {status === "success" && (
                        <p className="text-xs text-green-600 dark:text-green-500">✓ Mensaje enviado. Te respondemos pronto.</p>
                    )}
                    {status === "error" && (
                        <p className="text-xs text-red-500">{errorMsg}</p>
                    )}
                    <button type="submit" disabled={isPending}
                        className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-neutral-950 font-medium text-sm rounded-lg transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Enviando..." : "Enviar mensaje"}
                    </button>
                </form>
            </div>
        </section>
    );
}