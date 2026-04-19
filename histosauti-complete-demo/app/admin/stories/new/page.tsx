import { StoryForm } from "@/components/admin/story-form";
import { createStoryAction } from "@/app/admin/stories/actions";
import { getCategories } from "@/lib/stories";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getStoryMediaConfigBySlug } from "@/lib/media-manager";

export default async function NewStoryPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; slug?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const [categories, mediaConfig] = await Promise.all([
    getCategories(),
    params?.slug ? getStoryMediaConfigBySlug(params.slug) : Promise.resolve(null)
  ]);
  const error = params?.error;

  return (
    <>
      {!isSupabaseConfigured ? (
        <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          Local Studio Mode iko ON. Unaweza ku-create na ku-edit stories pamoja na media configs moja kwa moja kwenye project hii hata bila Supabase.
        </div>
      ) : null}

      <StoryForm
        mode="create"
        action={createStoryAction}
        categories={categories}
        error={error}
        mediaConfig={mediaConfig}
      />
    </>
  );
}
