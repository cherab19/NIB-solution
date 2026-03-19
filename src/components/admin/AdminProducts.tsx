import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Trash2, Pencil, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ProductForm { title: string; description: string; image_url: string; url: string; features: string; sort_order: number; is_active: boolean; }
const emptyForm: ProductForm = { title: "", description: "", image_url: "", url: "", features: "", sort_order: 0, is_active: true };

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description || null,
        image_url: form.image_url || null,
        url: form.url || null,
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
        sort_order: form.sort_order,
        is_active: form.is_active,
      };
      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(editingId ? "Product updated" : "Product created");
      setOpen(false); setForm(emptyForm); setEditingId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
  });

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({ title: p.title, description: p.description ?? "", image_url: p.image_url ?? "", url: (p as any).url ?? "", features: (p.features ?? []).join(", "), sort_order: p.sort_order, is_active: p.is_active });
    setOpen(true);
  };

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="hero" onClick={() => { setEditingId(null); setForm(emptyForm); setOpen(true); }}><Plus className="h-4 w-4 mr-1" /> New Product</Button>
      </div>
      <div className="space-y-3">
        {(products ?? []).map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground">{p.title}</h3>
              <p className="text-xs text-muted-foreground">
                {(p.features ?? []).length} features {!p.is_active && "• Inactive"}
                {(p as any).url && (
                  <a href={(p as any).url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 ml-2 text-primary hover:underline">
                    <ExternalLink className="h-3 w-3" /> Live URL
                  </a>
                )}
              </p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(p.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-heading">{editingId ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4 mt-2">
            <Input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            <Input placeholder="Live Website URL (e.g. https://example.com)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            <Input placeholder="Features (comma-separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
            <Input type="number" placeholder="Sort Order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <span className="text-sm text-foreground">Active</span>
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminProducts;
