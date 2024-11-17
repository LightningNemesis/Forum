"use client";
import { useActionState } from "react";
import {
  Input,
  Button,
  Textarea,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import * as actions from "@/actions/index";
import FormButton from "@/components/common/form-button";

interface PostCreateFormProps {
  slug: string;
}

export default function PostCreateForm({ slug }: PostCreateFormProps) {
  const [actionState, action] = useActionState(
    actions.createPost.bind(null, slug),
    {
      errors: {},
    }
  );

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button color="primary">Create a Post</Button>
      </PopoverTrigger>

      <PopoverContent>
        <form action={action}>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Post</h3>

            <Input
              isInvalid={!!actionState.errors.title}
              errorMessage={actionState.errors.title?.join(", ")}
              name="title"
              label="Title"
              labelPlacement="outside"
              placeholder="Title"
            />
            <Textarea
              isInvalid={!!actionState.errors.content}
              errorMessage={actionState.errors.content?.join(", ")}
              name="content"
              label="Content"
              labelPlacement="outside"
              placeholder="Content"
            />

            {actionState.errors._form && (
              <div className="p-2 bg-red-200 border border-red-400 rounded">
                {actionState.errors._form.join(", ")}
              </div>
            )}
            <FormButton>Create a Post</FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
