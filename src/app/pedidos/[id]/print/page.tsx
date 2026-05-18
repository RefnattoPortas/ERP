import { getPedidoById } from "../../../(dashboard)/pedidos/actions";
import { getConfiguracoes } from "../../../(dashboard)/configuracoes/actions";
import { notFound } from "next/navigation";
import PrintActions from "./PrintActions";

export default async function PrintPedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const [pedido, config] = await Promise.all([
    getPedidoById(resolvedParams.id),
    getConfiguracoes(),
  ]);

  if (!pedido) {
    notFound();
  }

  // Fallbacks para a empresa caso não haja configurações ou campos
  const empresa = {
    nome: config?.nomeFantasia || config?.razaoSocial || "NOME DA EMPRESA",
    razao: config?.razaoSocial || "",
    cnpj: config?.cnpj || "00.000.000/0000-00",
    endereco: config?.logradouro 
      ? `${config.logradouro}, ${config.bairro || ""} - ${config.cidade || ""}/${config.estado || ""} - CEP: ${config.cep || ""}`
      : "Endereço da Empresa",
    contato: [config?.telefone, config?.email].filter(Boolean).join(" | ") || "Contato da Empresa",
    validade: config?.validadeOrcamento || 15
  };

  const cliente: any = pedido.cliente || {};

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white flex items-start justify-center py-8 print:py-0 font-sans text-gray-900">
      <PrintActions />

      {/* A4 Container */}
      <div className="w-[210mm] min-h-[297mm] bg-white print:w-full print:min-h-0 print:shadow-none shadow-2xl overflow-hidden flex flex-col relative mx-auto">
        
        {/* Cabecalho Empresa */}
        <div className="px-10 py-8 border-b border-gray-200 bg-gray-50/50 print:bg-transparent">
          <div className="flex justify-between items-start gap-12">
            {/* Espaço para Logo */}
            <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-center p-4 print:border-gray-300">
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sua Logo Aqui</p>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-1">
                {empresa.nome}
              </h1>
              {empresa.razao && empresa.razao !== empresa.nome && (
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">
                  {empresa.razao}
                </p>
              )}
              <div className="space-y-1 text-xs font-medium text-gray-600">
                <p><strong className="font-bold">CNPJ:</strong> {empresa.cnpj}</p>
                <p><strong className="font-bold">Endereço:</strong> {empresa.endereco}</p>
                <p><strong className="font-bold">Contato:</strong> {empresa.contato}</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end justify-center pt-2">
              <div className="border-2 border-slate-900 p-3 rounded-lg bg-white print:bg-transparent inline-block">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Documento</p>
                <p className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  {pedido.status === "Orçamento" ? "ORÇAMENTO" : "PEDIDO"}
                </p>
                <p className="text-sm font-bold text-gray-600 font-mono mt-1">{pedido.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cabecalho Cliente */}
        <div className="px-10 py-6 border-b border-gray-200 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Dados do Cliente</h2>
            <p className="text-sm font-black text-slate-900 uppercase mb-1">
              {cliente.name || "Cliente não informado"}
            </p>
            {cliente.company && (
              <p className="text-xs font-bold text-gray-600 mb-2 uppercase">{cliente.company}</p>
            )}
            <div className="text-xs font-medium text-gray-600 space-y-1 mt-2">
              {cliente.doc && <p><strong className="font-bold">Doc:</strong> {cliente.doc}</p>}
              {cliente.phone && <p><strong className="font-bold">Telefone:</strong> {cliente.phone}</p>}
              {cliente.email && <p><strong className="font-bold">E-mail:</strong> {cliente.email}</p>}
            </div>
          </div>
          
          <div className="text-right ml-8 min-w-32">
             <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Emissão</h2>
             <p className="text-sm font-black text-slate-900">{pedido.date}</p>
             <p className="text-[10px] font-bold text-gray-500 mt-2">Validade: {empresa.validade} dias</p>
          </div>
        </div>

        {/* Tabela de Itens */}
        <div className="px-10 py-6 flex-1">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Itens do Documento</h2>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 w-12 text-center">Item</th>
                <th className="py-2 text-[10px] font-black uppercase tracking-widest text-slate-900">Descrição</th>
                <th className="py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 text-center w-16">Unid.</th>
                <th className="py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 text-center w-16">Qtd.</th>
                <th className="py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 text-right w-24">V. Unit.</th>
                <th className="py-2 text-[10px] font-black uppercase tracking-widest text-slate-900 text-right w-28">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pedido.itens?.map((item: any, index: number) => (
                <tr key={item.id} className="text-xs">
                  <td className="py-3 text-center font-bold text-gray-500">{index + 1}</td>
                  <td className="py-3 font-bold text-slate-800 uppercase pr-4">
                    {item.produto?.name || "Produto Genérico"}
                  </td>
                  <td className="py-3 text-center text-gray-600 font-medium">{item.unit || "UN"}</td>
                  <td className="py-3 text-center text-gray-600 font-medium">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-600 font-medium">R$ {item.price.toFixed(2)}</td>
                  <td className="py-3 text-right font-black text-slate-800">
                    R$ {(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
              {(!pedido.itens || pedido.itens.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-xs text-gray-400 italic font-medium">
                    Nenhum item registrado neste documento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totais */}
        <div className="px-10 py-6 border-t border-gray-200 bg-gray-50/30 print:bg-transparent break-inside-avoid">
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span className="font-bold uppercase">Subtotal</span>
                <span className="font-medium">R$ {pedido.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span className="font-bold uppercase">Descontos</span>
                <span className="font-medium">R$ 0.00</span>
              </div>
              <div className="pt-3 border-t border-gray-300 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Valor Final</span>
                <span className="text-xl font-black text-slate-900">R$ {pedido.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodape / Assinatura */}
        <div className="px-10 pb-10 pt-6 mt-auto break-inside-avoid">
           <div className="grid grid-cols-2 gap-12 mt-12">
              <div className="text-center">
                 <div className="border-t border-gray-400 w-full mb-2"></div>
                 <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{empresa.nome}</p>
                 <p className="text-[9px] text-gray-400 uppercase">Emissor</p>
              </div>
              <div className="text-center">
                 <div className="border-t border-gray-400 w-full mb-2"></div>
                 <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{cliente.name || "Cliente"}</p>
                 <p className="text-[9px] text-gray-400 uppercase">Aceite</p>
              </div>
           </div>
           
           <div className="mt-12 text-center border-t border-gray-200 pt-6">
             <p className="text-[9px] font-medium text-gray-400">
               Documento gerado eletronicamente em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')} - Válido por {empresa.validade} dias a partir da data de emissão.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}
