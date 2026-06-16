"use client";

import { 
  ArrowLeft, 
  UploadCloud, 
  Barcode, 
  Tag, 
  Image as ImageIcon,
  Save,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { saveItemEstoque, getItemEstoque } from "../actions";
import { useRouter, useSearchParams } from "next/navigation";

function NovoProdutoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<{ name: string, sku: string, category: string, stock: number, minStock: number, cost: number, purchasePrice: number, supplier: string, critical: boolean, photoUrl?: string }>({
    name: "",
    sku: "",
    category: "final",
    stock: 0,
    minStock: 0,
    cost: 0,
    purchasePrice: 0,
    supplier: "",
    critical: false
  });

  useEffect(() => {
    if (id) {
      async function load() {
        const item = await getItemEstoque(Number(id));
        if (item) {
          setFormData(item);
        }
        setIsLoading(false);
      }
      load();
    }
  }, [id]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotoPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await saveItemEstoque(formData);
      if (res.success) {
        router.push("/estoque");
      } else {
        alert(res.error || "Erro ao salvar produto");
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Clássico Formulário */}
      <div className="flex items-center gap-4 border-b border-card-border pb-5">
        <Link href="/estoque" className="p-2 border border-card-border rounded-md hover:bg-card transition text-muted">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-foreground leading-tight uppercase tracking-tighter">
            {id ? "Editar Item" : "Cadastrar Novo Item"}
          </h1>
          <p className="text-xs text-muted font-medium italic">
            {id ? "Atualize as informações do produto no inventário." : "Adicione um novo produto, insumo ou matéria-prima ao inventário."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SEÇÃO 1: FOTO & IDENTIFICAÇÃO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2 uppercase tracking-tight"><ImageIcon size={18} className="text-secondary"/> Mídia do Produto</h3>
            <p className="text-[10px] text-muted font-bold mt-1 uppercase tracking-tight leading-relaxed">Essa imagem aparecerá no PDV e nas listagens rápidas do painel.</p>
          </div>
          
          <div className="md:col-span-2 bg-card p-6 rounded-[5px] shadow-sm border border-card-border">
            <label className="block text-[10px] font-black text-muted mb-1.5 uppercase tracking-widest">Foto do Item</label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-card-border px-6 py-10 hover:bg-background transition-colors relative cursor-pointer group">
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              
              <div className="text-center flex flex-col items-center">
                {photoPreview || formData.photoUrl ? (
                   <img src={photoPreview || formData.photoUrl} alt="Preview" className="h-32 object-contain rounded-md" />
                ) : (
                  <>
                    <UploadCloud className="mx-auto h-12 w-12 text-muted group-hover:text-secondary transition-colors" />
                    <div className="mt-4 flex text-[10px] font-black leading-6 text-muted uppercase tracking-widest">
                      <span className="relative text-secondary hover:underline">
                        Clique para Upload
                      </span>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-[9px] font-bold text-muted uppercase">PNG, JPG, WEBP até 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <hr className="border-card-border" />

        {/* SEÇÃO 2: DADOS CADASTRAIS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2 uppercase tracking-tight"><Tag size={18} className="text-secondary"/> Detalhes</h3>
            <p className="text-[10px] text-muted font-bold mt-1 uppercase tracking-tight leading-relaxed">Classifique o tipo de item para garantir a entrada e saída corretas de estoque.</p>
          </div>
          
          <div className="md:col-span-2 bg-card p-6 rounded-[5px] shadow-sm border border-card-border space-y-5">
             <div className="space-y-1">
                <label className="block text-[10px] font-black text-muted mb-1.5 uppercase tracking-widest">Nome do Produto</label>
                <input 
                  type="text" 
                  placeholder="Ex: Papel Sulfite A4 75g (Caixa Rosa)" 
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="flex items-center gap-1 text-[10px] font-black text-muted mb-1.5 uppercase tracking-widest">Fornecedor</label>
                  <input 
                    type="text" 
                    placeholder="Nome do Fornecedor" 
                    className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                    value={formData.supplier || ""}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  />
               </div>
               <div className="space-y-1">
                  <label className="block text-[10px] font-black text-muted mb-1.5 uppercase tracking-widest">SKU (Código Interno)</label>
                  <input 
                    type="text" 
                    placeholder="PAP-SUL-001" 
                    className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all uppercase"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  />
               </div>
             </div>

             <div className="space-y-1">
                <label className="block text-[10px] font-black text-muted mb-1.5 uppercase tracking-widest">Categoria do Item</label>
                <select 
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all appearance-none"
                  value={formData.category || "final"}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="final">Produto Final (Venda Direta)</option>
                  <option value="insumo">Insumo / Matéria Prima</option>
                  <option value="servico">Serviço (Mão de Obra)</option>
                </select>
             </div>
          </div>
        </div>

        <hr className="border-card-border" />

        {/* SEÇÃO 3: FINANCEIRO E ESTOQUE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="md:col-span-1">
            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Valores e Saldo</h3>
            <p className="text-[10px] text-muted font-bold mt-1 uppercase tracking-tight leading-relaxed">Valores de compra e estoque inicial para controle de ativos.</p>
          </div>

          <div className="md:col-span-2 bg-card p-6 rounded-[5px] shadow-sm border border-card-border">
             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <label className="block text-[10px] font-black text-muted mb-1.5 uppercase tracking-widest">Preço de Compra (R$)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-bold">R$</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      className="w-full bg-background border border-card-border rounded-xl py-3 pr-4 pl-10 text-sm font-black text-foreground focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-right"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({...formData, purchasePrice: Number(e.target.value)})}
                    />
                  </div>
               </div>
               <div className="space-y-1">
                  <label className="block text-[10px] font-black text-muted mb-1.5 uppercase tracking-widest">Valor de Custo (R$)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-bold">R$</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      className="w-full bg-background border border-card-border rounded-xl py-3 pr-4 pl-10 text-sm font-black text-foreground focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-right shadow-inner"
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})}
                    />
                  </div>
               </div>
               <div className="space-y-1">
                  <label className="block text-[10px] font-black text-muted mb-1.5 uppercase tracking-widest">Estoque Mínimo</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-black text-foreground focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-right" 
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                    />
                  </div>
               </div>
               <div className="space-y-1">
                  <label className="block text-[10px] font-black text-muted mb-1.5 uppercase tracking-widest">Estoque Atual</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm font-black text-foreground focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all text-right" 
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    />
                  </div>
               </div>
             </div>
          </div>
        </div>

        {/* Botões de Ação na base */}
        <div className="flex justify-end gap-3 pt-8 border-t border-card-border">
            <Link href="/estoque" className="flex items-center gap-2 bg-background text-muted border border-card-border px-6 py-3 rounded-[5px] font-black text-[10px] uppercase tracking-widest hover:bg-card transition-all">
              <XCircle size={14} /> CANCELAR
            </Link>
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-[5px] font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-secondary/20 disabled:opacity-50"
            >
              <Save size={14} />
              {isSaving ? "SALVANDO..." : (id ? "ATUALIZAR ITEM" : "SALVAR PRODUTO")}
            </button>
        </div>

      </form>
    </div>
  );
}

export default function NovoProdutoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <NovoProdutoForm />
    </Suspense>
  );
}
