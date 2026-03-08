import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

interface StatForm { label: string; value: string; sort_order: number; }
const emptyForm: StatForm = { label: "", value: "", sort_order: 0 };

const AdminStats = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StatForm>(emptyForm);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_stats").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { label: form.label, value: form.value, sort_order: form.sort_order };
      if (editingId) {
        const { error } = await supabase.from("site_stats").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_stats").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(editingId ? "Stat updated" : "Stat created");
      setOpen(false); setForm(emptyForm); setEditingId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_stats").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-stats"] }); toast.success("Stat deleted"); },
  });

  const openEdit = (s: any) => {
    setEditingId(s.id);
    setForm({ label: s.label, value: s.value, sort_order: s.sort_order });
    setOpen(true);
  };

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="hero" onClick={() => { setEditingId(null); setForm(emptyForm); setOpen(true); }}><Plus className="h-4 w-4 mr-1" /> New Stat</Button>
      </div>
      <div className="space-y-3">
        {(stats ?? []).map((s) => (
          <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
            <div><h3 className="font-semibold text-foreground">{s.value}</h3><p className="text-xs text-muted-foreground">{s.label}</p></div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(s.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle className="font-heading">{editingId ? "Edit Stat" : "New Stat"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4 mt-2">
            <Input placeholder="Value (e.g. 10+)" required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            <Input placeholder="Label (e.g. Projects Delivered)" required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
            <Input type="number" placeholder="Sort Order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            <Button type="submit" variant="hero" className="w-full" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminStats;
