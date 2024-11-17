"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Topic } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/db";
import { paths } from "@/paths";

interface createTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

const createTopicSchema = z.object({
  name: z.string().min(3).regex(/[a-z]/, {
    message: "Must be lowercase letters or dashes without spaces",
  }),
  description: z.string().min(10),
});

export async function createTopic(
  formState: createTopicFormState,
  formData: FormData
): Promise<createTopicFormState> {
  await new Promise((resolve) => setTimeout(resolve, 3500));

  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!result.success) {
    console.log(result.error.flatten().fieldErrors);
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this"],
      },
    };
  }

  let topic: Topic;
  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
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
          _form: ["Something went wrong"],
        },
      };
    }
  }

  console.log("Returning from createTopic", topic);
  revalidatePath("/");
  redirect(paths.topicShowPath(topic.slug));

  return {
    errors: {},
  };
}
