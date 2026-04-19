import { notFound } from "next/navigation";
import { StoryForm } from "@/components/admin/story-form";
import { updateStoryAction } from "@/app/admin/stories/actions";
import { getAdminStoryById, getCategories } from "@/lib/stories";
import { getStoryMediaConfigBySlug } from "@/lib/media-manager";

export default async function EditStoryPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const [story, categories, query] = await Promise.all([
    getAdminStoryById(id),
    getCategories(),
    searchParams ? searchParams : Promise.resolve(undefined)
  ]);

  if (!story) {
    notFound();
  }

  const mediaConfig = await getStoryMediaConfigBySlug(story.slug);

  return (
    <StoryForm
      mode="edit"
      action={updateStoryAction}
      categories={categories}
      story={story}
      error={query?.error}
      mediaConfig={mediaConfig}
    />
  );
}
