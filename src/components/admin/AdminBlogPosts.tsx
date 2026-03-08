import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Trash2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface BlogForm {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  image_url: string;
  seo_title: string;
  seo_description: string;
  is_published: boolean;
}

const emptyForm: BlogForm = {
  title: "", slug: "", description: "", content: "", category: "",
  image_url: "", seo_title: "", seo_description: "", is_published: false,
};

const AdminBlogPosts = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description || null,
        content: form.content || null,
        category: form.category || null,
        image_url: form.image_url || null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        is_published: form.is_published,
        published_at: form.is_published ? new Date().toISOString() : null,
      };
      if (editingId) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success(editingId ? "Post updated" : "Post created");
      setOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Post deleted");
    },
  });

  const openEdit = (post: any) => {
    setEditingId(post.id);
    setForm({
      title: post.title, slug: post.slug, description: post.description ?? "",
      content: post.content ?? "", category: post.category ?? "",
      image_url: post.image_url ?? "", seo_title: post.seo_title ?? "",
      seo_description: post.seo_description ?? "", is_published: post.is_published,
    });
    setOpen(true);
  };

  const openNew = () => { setEditingId(null); setForm(emptyForm); setOpen(true); };

  const generateSlug = () => {
    setForm(f => ({ ...f, slug: f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }));
  };

  if (isLoading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="hero" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> New Post</Button>
      </div>

      <div className="space-y-3">
        {(posts ?? []).map((post) => (
          <div key={post.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
              <p className="text-xs text-muted-foreground">
                {post.is_published ? `Published ${post.published_at ? format(new Date(post.published_at), "PP") : ""}` : "Draft"}
                {post.category && ` • ${post.category}`}
              </p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => openEdit(post)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(post.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editingId ? "Edit Post" : "New Post"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4 mt-2">
            <Input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div className="flex gap-2">
              <Input placeholder="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="flex-1" />
              <Button type="button" variant="outline" size="sm" onClick={generateSlug}>Auto</Button>
            </div>
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            <Textarea placeholder="Short description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            <Textarea placeholder="Full content (Markdown supported)..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} />
            <Input placeholder="SEO Title" value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
            <Textarea placeholder="SEO Description" value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} rows={2} />
            <div className="flex items-center gap-2">
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
              <span className="text-sm text-foreground">Published</span>
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

export default AdminBlogPosts;
