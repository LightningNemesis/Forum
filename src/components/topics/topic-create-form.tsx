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

export default function TopicCreateForm() {
  const [actionState, action] = useActionState(actions.createTopic, {
    errors: {},
  });

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button color="primary">Create a Topic</Button>
      </PopoverTrigger>

      <PopoverContent>
        <form action={action}>
          <div className="flex flex-col gap-4 p-4 w-80">
            <h3 className="text-lg">Create a Topic</h3>
            <Input
              name="name"
              label="Name"
              labelPlacement="outside"
              placeholder="Name"
              isInvalid={!!actionState.errors.name}
              errorMessage={actionState.errors.name?.join(", ")}
            />

            <Textarea
              name="description"
              label="Description"
              labelPlacement="outside"
              placeholder="Describe your topic"
              isInvalid={!!actionState.errors.description}
              errorMessage={actionState.errors.description?.join(", ")}
            />

            {actionState.errors._form && (
              <div className="p-2 bg-red-200 border border-red-400 rounded">
                {actionState.errors._form.join(", ")}
              </div>
            )}

            <FormButton>Save</FormButton>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
