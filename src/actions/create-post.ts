"use server";

import { z } from "zod";
import type { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { paths } from "@/paths";

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

interface CreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
}

export async function createPost(
  slug: string,
  formState: CreatePostFormState, // becaue we are using useActionState, we need to pass the formState
  formData: FormData // the form data from the form
): Promise<CreatePostFormState> {
  // TODO: Revalidate Topic Show Page

  // validating the data received using zod
  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  // if the validation fails, return the errors
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Ensuring the user is signed in before creating a post
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this"],
      },
    };
  }

  // Get userId
  const userId = session.user.id;
  if (!userId) {
    return {
      errors: {
        _form: ["User not found"],
      },
    };
  }

  // Get topicId
  const topic = await db.topic.findFirst({
    where: {
      slug,
    },
  });

  // If the topic is not found, return an error
  if (!topic) {
    return {
      errors: {
        _form: ["Topic not found"],
      },
    };
  }

  // Create the post

  let post: Post;
  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId,
        topicId: topic.id,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Failed to create Post"],
        },
      };
    }
  }

  revalidatePath(paths.topicShowPath(slug));
  redirect(paths.postShowPath(slug, post.id));
}
