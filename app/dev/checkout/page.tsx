"use client";

import { useState } from "react";

export default function DevCheckoutPage() {
    const [formData, setFormData] = useState({
        id: "1001",
        fecha: new Date().toISOString(),
        comprador_id: "user_clerk_999",
        vendedor_id: "seller_123",
        monto: 150000,
        productosRaw: "[10, 11, 12]" 
    });

    const [response, setResponse] = useState<any>(null);
    const [status, setStatus] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "monto" ? Number(value) : value
        }));
    };

    async function handleTestCheckout(e: React.FormEvent) {
        e.preventDefault();
        try {
            setLoading(true);
            setResponse(null);
            setStatus(null);

            let productos: any[] = [];
            try {
                productos = JSON.parse(formData.productosRaw);
            } catch (err) {
                alert("El campo de productos debe ser un JSON válido (ej: [1, 2, 3])");
                setLoading(false);
                return;
            }

            const payload = {
                id: formData.id,
                fecha: formData.fecha,
                comprador_id: formData.comprador_id,
                vendedor_id: formData.vendedor_id,
                monto: formData.monto,
                productos: productos
            };

            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            setStatus(res.status);
            const data = await res.json();
            setResponse(data);
        } catch (error) {
            console.error(error);
            setResponse({ error: "Error en la petición de red" });
        } finally {
            setLoading(false);
        }
    }

    const refrescarFecha = () => {
        setFormData(prev => ({ ...prev, fecha: new Date().toISOString() }));
    };

    return (
        <div className="p-10 max-w-5xl mx-auto space-y-6 bg-gray-950 text-gray-100 min-h-screen">
            <div>
                <h1 className="text-2xl font-bold text-white">API Checkout Tester</h1>
                <p className="text-sm text-gray-400">Prueba las validaciones de Zod, Clerk y Prisma manipulando los datos de entrada.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form onSubmit={handleTestCheckout} className="space-y-4 border border-gray-800 p-5 rounded-lg bg-gray-900 shadow-xl">
                    <h2 className="text-lg font-semibold border-b border-gray-800 pb-2 text-white">Datos del Pedido</h2>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">ID del Pedido (String o Número)</label>
                        <input type="text" name="id" value={formData.id} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-medium text-gray-400">Fecha (ISO String)</label>
                            <button type="button" onClick={refrescarFecha} className="text-xs text-blue-400 hover:underline">Ahora</button>
                        </div>
                        <input type="text" name="fecha" value={formData.fecha} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-blue-300 font-mono text-sm focus:outline-none focus:border-blue-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Comprador ID</label>
                            <input type="text" name="comprador_id" value={formData.comprador_id} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Vendedor ID</label>
                            <input type="text" name="vendedor_id" value={formData.vendedor_id} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Monto (Prueba con negativos o 0)</label>
                        <input type="number" name="monto" value={formData.monto} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Productos (Array en JSON / Prueba con `[]` vacío)</label>
                        <input type="text" name="productosRaw" value={formData.productosRaw} onChange={handleChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-green-400 font-mono text-sm focus:outline-none focus:border-blue-500" />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded text-white font-medium transition-colors ${loading ? "bg-gray-700 text-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {loading ? "Enviando..." : "Enviar a /api/checkout"}
                    </button>
                </form>

                <div className="flex flex-col space-y-4">
                    <h2 className="text-lg font-semibold border-b border-gray-800 pb-2 text-white">Respuesta de la API</h2>
                    
                    {status && (
                        <div className={`p-2 rounded text-sm font-bold w-fit ${status >= 200 && status < 300 ? "bg-green-950/80 border border-green-800 text-green-400" : "bg-red-950/80 border border-red-800 text-red-400"}`}>
                            Status: {status}
                        </div>
                    )}

                    <div className="flex-1 bg-black border border-gray-800 text-green-400 p-4 rounded-lg overflow-auto font-mono text-sm shadow-inner min-h-[340px]">
                        {response ? (
                            <pre>{JSON.stringify(response, null, 2)}</pre>
                        ) : (
                            <span className="text-gray-600 italic">Haz clic en enviar para ver la respuesta...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}