import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import blogDigital from "@/assets/blog-digital.png";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("is_published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="text-2xl font-heading font-bold text-foreground">Post not found</h1>
        <Link to="/" className="text-primary hover:underline">← Back to home</Link>
      </div>
    );
  }

  return (
    <>
      {post.seo_title && <title>{post.seo_title}</title>}
      {post.seo_description && <meta name="description" content={post.seo_description} />}

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Link to="/#blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to articles
          </Link>

          <article>
            <div className="mb-6">
              {post.category && (
                <span className="text-xs font-medium text-gold uppercase tracking-widest">{post.category}</span>
              )}
              <h1 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight">
                {post.title}
              </h1>
              {post.published_at && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {format(new Date(post.published_at), "MMMM d, yyyy")}
                </p>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden mb-8">
              <img
                src={post.image_url || blogDigital}
                alt={post.title}
                className="w-full aspect-video object-cover"
              />
            </div>

            {post.description && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{post.description}</p>
            )}

            {post.content && (
              <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            )}
          </article>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
